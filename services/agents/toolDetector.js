import groq from "../groq.service.js";
import { tools } from "../toolDefinitions.js";

const TOOL_ROUTER_PROMPT = `
You are a support tool router for ShopEase.

Choose the best action for the latest customer message using the available tools.

Rules:
- Decide support scope by understanding the meaning of the message, not by keyword matching.
- Only handle ShopEase customer support questions.
- Use a tool only when it clearly helps answer the customer.
- If the customer asks about an order or refund and the order ID is missing, ask a short clarifying question instead of calling a tool.
- If the customer wants a human, call escalate_to_human.
- If the customer asks a general support question, call search_knowledge_base.
- If the question is outside ShopEase support, return a short refusal instead of answering it.
- Return either a tool call or a short reply. Do not do both.
`;

export const detectTool = async (history, lastUserMessage) => {
  const conversationText = history
    .slice(-8)
    .map(
      (message) =>
        `${message.role.toUpperCase()}: ${message.content}`
    )
    .join("\n");

  const response = await groq.chat.completions.create({
    model: process.env.MODEL,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: TOOL_ROUTER_PROMPT,
      },
      {
        role: "user",
        content: `Conversation so far:\n${conversationText}\n\nLatest customer message:\n${lastUserMessage}`,
      },
    ],
    tools,
    tool_choice: "auto",
  });

  const message = response.choices[0].message;
  const toolCall = message.tool_calls?.[0];

  if (toolCall) {
    let args = {};

    try {
      args = JSON.parse(toolCall.function.arguments || "{}");
    } catch {
      args = {};
    }

    return {
      type: "tool",
      name: toolCall.function.name,
      args,
    };
  }

  return {
    type: "reply",
    message: message.content?.trim() || "I'm here to help with ShopEase support.",
  };
};