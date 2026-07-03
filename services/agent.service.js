import groq from "./groq.service.js";

export const runAgent = async (messages) => {
  try {
    const response = await groq.chat.completions.create({
      model: process.env.MODEL,
      messages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("LLM_ERROR");
  }
};