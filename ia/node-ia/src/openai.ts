import "dotenv/config";
import { string, z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat, zodTextFormat } from "openai/helpers/zod";
import {
  type ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import {
  produtosEmEstoque,
  produtosEmFalta,
  setarEmbedding,
  todosProdutos,
} from "./database";
import { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses.mjs";
import { ReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const schema = z.object({
  produtos: z.array(z.string()),
});

const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "produtos_em_estoque",
      description: "Lista os produtos que estão em estoque.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "produtos_em_falta",
      description: "Lista os produtos que estão em falta.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

const generateCompletiion = async (
  messages: ChatCompletionMessageParam[],
  format: any,
) => {
  const completion = await client.chat.completions.parse({
    model: "gpt-4o-mini",
    max_completion_tokens: 100,
    response_format: format,
    tools,
    messages,
  });

  if (completion.choices[0].message.refusal) {
    throw new Error("Refusal");
  }

  const { tool_calls } = completion.choices[0].message;

  if (tool_calls) {
    const [tool_call] = tool_calls;

    const toolsMap = {
      produtos_em_estoque: produtosEmEstoque,
      produtos_em_falta: produtosEmFalta,
    };

    const functionToCall =
      toolsMap[tool_call.function.name as keyof typeof toolsMap];

    if (!functionToCall) {
      throw new Error("Function not found");
    }

    const result = functionToCall();

    messages.push(completion.choices[0].message);
    messages.push({
      role: "tool",
      tool_call_id: tool_call.id,
      content: result.toString(),
    });

    return await generateCompletiion(
      messages,
      zodResponseFormat(schema, "produtos_schema"),
    );
  }

  return completion;
};

export const generateProducts = async (message: string) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "developer",
      content:
        "Liste três produtos que atendam a necessidade do usuário. Considere apenas os produtos em estoque",
    },
    {
      role: "user",
      content: message,
    },
  ];

  const completion = await generateCompletiion(
    messages,
    zodResponseFormat(schema, "produtos_schema"),
  );

  return completion.choices[0].message.parsed;
};

export const generateEmbedding = async (input: string) => {
  try {
    const response = await client.embeddings.create({
      input,
      model: "text-embedding-3-small",
      encoding_format: "float",
    });

    return response.data[0].embedding ?? null;
  } catch {
    return null;
  }
};

export const embeddingProducts = async () => {
  const produtos = todosProdutos();

  await Promise.allSettled(
    produtos.map(async (p, index) => {
      const embedding = await generateEmbedding(`${p.nome}; ${p.descricao}`);
      if (!embedding) return;
      setarEmbedding(index, embedding);
    }),
  );
};

export const generateResponse = async <T = null>(
  params: ResponseCreateParamsNonStreaming,
) => {
  const response = await client.responses.parse(params);
  if (response.output_parsed) return response.output_parsed as T;

  return null;
};

export const createCartPromptChunks = (input: string, products: string[]) => {
  const chunckSize = 10;
  const chunks: string[] = [];

  for (let i = 0; i < products.length; i += chunckSize) {
    chunks.push(
      `Retorne um  lista  de até 5 produtos que satisfaça a necessidade do usuário. Os produtos disponíveis são os seguintes ${JSON.stringify(products.slice(i, i + chunckSize))}`,
    );
  }

  return chunks;
};

export const generateCart = async (input: string, products: string[]) => {
  const promisses = createCartPromptChunks(input, products).map((chunk) => {
    return generateResponse<{ produtos: string[] }>({
      model: "gpt-4.1-nano",
      instructions: chunk,
      input,
      tools: [
        {
          type: "file_search",
          vector_store_ids: ["vs_6973a21366008191beabf649ca5f0eb4"],
        },
      ],
      text: {
        format: zodTextFormat(schema, "carrinho"),
      },
    });
  });

  const results = await Promise.all(promisses);
  return results
    .filter((r): r is { produtos: string[] } => Boolean(r))
    .flatMap((r) => r.produtos);
};

export const uploadFile = async (file: ReadStream) => {
  const uploaded = await client.files.create({
    file,
    purpose: "assistants",
  });

  console.log(uploaded, { depth: null });
};

export const createVector = async () => {
  const vectorStore = await client.vectorStores.create({
    name: "node-ia",
    file_ids: ["file-QfDC8EdW1GusVwpSffa3ng"],
  });

  console.log(vectorStore, { depth: null });
};

export const createEmbeddingBatchFile = async (products: string[]) => {
  const content = products
    .map((p, i) => ({
      custom_id: String(i),
      method: "POST",
      url: "/v1/embeddings",
      body: {
        input: p,
        model: "text-embedding-3-small",
        encoding_format: "float",
      },
    }))
    .map((p) => JSON.stringify(p))
    .join("\n");

  const file = new File([content], "embeddings-batch.jsonl");
  const uploaded = await client.files.create({
    file,
    purpose: "batch",
  });

  return uploaded;

  // await writeFile(path.join(__dirname, "file.jsonl"), content);
};

export const createEmbeddingsBatch = async (fileId: string) => {
  const batch = await client.batches.create({
    input_file_id: fileId,
    endpoint: "/v1/embeddings",
    completion_window: "24h",
  });

  return batch;
};

export const getBatch = async (id: string) => {
  return await client.batches.retrieve(id);
};

export const getFileContent = async (id: string) => {
  const response = await client.files.content(id);

  return response.text();
};

export const processEmbeddingsBatchResult = async (batchId: string) => {
  const batch = await getBatch(batchId);
  if (batch.status !== "completed" || !batch.output_file_id) {
    return null;
  }

  const content = await getFileContent(batch.output_file_id);
  return content
    .split("\n")
    .map((line) => {
      try {
        const parsed = JSON.parse(line) as {
          custom_id: string;
          response: { body: { data: { embedding: number[] }[] } };
        };
        return {
          id: Number(parsed.custom_id),
          embeddings: parsed.response.body.data[0].embedding,
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    })
    .filter((r): r is { id: number; embeddings: number[] } => Boolean(r));
};

// client.vectorStores.files
//   .list("vs_6973a21366008191beabf649ca5f0eb4")
//   .then((res) => console.dir(res.data, { depth: null }));

// {
//   object: 'file',
//   id: 'file-QfDC8EdW1GusVwpSffa3ng',
//   purpose: 'assistants',
//   filename: 'recipes.md',
//   bytes: 2722,
//   created_at: 1769185338,
//   expires_at: null,
//   status: 'processed',
//   status_details: null
// } { depth: null }

// {
//   id: 'vs_6973a21366008191beabf649ca5f0eb4',
//   object: 'vector_store',
//   created_at: 1769185811,
//   name: 'node-ia',
//   description: null,
//   usage_bytes: 0,
//   file_counts: { in_progress: 1, completed: 0, failed: 0, cancelled: 0, total: 1 },
//   status: 'in_progress',
//   expires_after: null,
//   expires_at: null,
//   last_active_at: 1769185811,
//   metadata: {}
// } { depth: null }
