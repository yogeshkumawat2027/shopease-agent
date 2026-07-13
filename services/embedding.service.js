import { pipeline } from "@huggingface/transformers";

const EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL ||
  "Xenova/all-MiniLM-L6-v2";

let extractorPromise;

/**
 * Get or initialize the embedding pipeline.
 * Lazy loads the model only once and reuses the instance.
 */
const getExtractor = () => {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      EMBEDDING_MODEL
    );
  }

  return extractorPromise;
};

/**
 * Generate a normalized embedding for input text.
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} A normalized embedding vector
 */
export const createEmbedding = async (text) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Text is required for embedding");
  }

  try {
    const extractor = await getExtractor();
    const output = await extractor(text.trim(), {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
};
