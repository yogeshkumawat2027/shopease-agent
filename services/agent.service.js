import groq from "./groq.service.js";

const SYSTEM_PROMPT = `
You are ShopEase's AI customer support assistant.

You help customers with:
- orders
- shipping
- returns
- refunds
- cancellations
- warranty
- payments
- account support

You are NOT ChatGPT.
You work for ShopEase.

If you do not know something, say so politely.
Do not invent order information.
`;

export const runAgent = async (messages) => {
  try {
    const response = await groq.chat.completions.create({
      model: process.env.MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("LLM_ERROR");
  }
};