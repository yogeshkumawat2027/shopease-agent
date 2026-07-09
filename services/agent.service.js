import groq from "./groq.service.js";
import { executeTool } from "./toolExecutor.js";
import { SYSTEM_PROMPT } from "./prompts/systemPrompt.js";
import { tools } from "./toolDefinitions.js";

const MAX_TOOL_STEPS = 5;

const normalizeMessage = (message) => ({
  role: message.role,
  content: message.content,
});

const parseToolArguments = (argumentsText) => {
  if (!argumentsText) {
    return {};
  }

  try {
    return JSON.parse(argumentsText);
  } catch {
    return {};
  }
};

export const runAgent = async (history) => {
  try {
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...history.map(normalizeMessage),
    ];

    for (let step = 0; step < MAX_TOOL_STEPS; step += 1) {
      const response = await groq.chat.completions.create({
        model: process.env.MODEL,
        temperature: 0,
        messages,
        tools,
        tool_choice: "auto",
      });

      const assistantMessage = response.choices?.[0]?.message;

      if (!assistantMessage) {
        return "I'm here to help with ShopEase support.";
      }

      const toolCalls = assistantMessage.tool_calls ?? [];

      if (toolCalls.length === 0) {
        return (
          assistantMessage.content?.trim() ||
          "I'm here to help with ShopEase support."
        );
      }

      messages.push({
        role: "assistant",
        content: assistantMessage.content ?? null,
        tool_calls: toolCalls,
      });

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function?.name;
        const toolArgs = parseToolArguments(
          toolCall.function?.arguments
        );

        let toolResult;

        try {
          toolResult = await executeTool(toolName, toolArgs);
        } catch (error) {
          toolResult = {
            success: false,
            error: "TOOL_EXECUTION_ERROR",
            message:
              "I ran into a problem using one of my support tools.",
          };
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }
    }

    return "I'm having trouble responding right now. Please try again.";
  } catch (error) {
    console.error(error);
    throw new Error("LLM_ERROR");
  }
};