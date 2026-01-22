import "dotenv/config";
import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  type ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { produtosEmEstoque, produtosEmFalta } from "./database";

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
