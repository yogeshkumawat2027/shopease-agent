import groq from "./groq.service.js";
import { executeTool } from "./toolExecutor.js";
import { SYSTEM_PROMPT } from "./prompts/systemPrompt.js";
import { detectTool } from "./agents/toolDetector.js";
import { buildConversationText } from "./agents/conversationFormatter.js";

export const runAgent = async (history) => {
  try {
    const lastUserMessage = [...history]
      .reverse()
      .find((msg) => msg.role === "user")?.content;

    if (!lastUserMessage) {
      return "Please send a message so I can help you.";
    }

    const decision = await detectTool(history, lastUserMessage);

    if (decision.type === "reply") {
      return decision.message;
    }

    const toolCall = decision;

    if (
      (toolCall.name === "get_order_status" ||
        toolCall.name === "check_refund_eligibility") &&
      !toolCall.args?.order_id
    ) {
      return "Please provide your order ID so I can help with that.";
    }

    const toolResult = await executeTool(
      toolCall.name,
      toolCall.args
    );

    const conversationText =
      buildConversationText(history);

    const response =
      await groq.chat.completions.create({
        model: process.env.MODEL,
        temperature: 0,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `
Conversation so far:
${conversationText}

Tool used:
${toolCall.name}

Tool result:
${JSON.stringify(toolResult, null, 2)}

Write the final customer support reply.
`,
          },
        ],
      });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("LLM_ERROR");
  }
};