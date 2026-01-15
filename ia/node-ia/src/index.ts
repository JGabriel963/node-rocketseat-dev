import "dotenv/config";
import app from "./app";
import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const schema = z.object({
  produtos: z.array(z.string()),
});

app.post("/generate", async (req, res) => {
  try {
    const completion = await client.chat.completions.parse({
      model: "gpt-4o-mini",
      max_completion_tokens: 100,
      response_format: zodResponseFormat(schema, "produtos_schema"),
      messages: [
        {
          role: "developer",
          content: "Liste três produtos que atendam a necessidade do usuário.",
        },
        {
          role: "user",
          content: req.body.message,
        },
      ],
    });

    res.json(completion.choices[0].message.parsed?.produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
