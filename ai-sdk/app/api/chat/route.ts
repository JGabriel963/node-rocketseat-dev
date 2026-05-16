import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const convertedMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            "You are a helpful coding assistant. Keep responses under 3 sentences and focus on practical examples.",
        },
        ...convertedMessages,
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
