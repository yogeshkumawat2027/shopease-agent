import faqsData from "../data/faqs.json" with { type: "json" };
import { createEmbedding } from "./embedding.service.js";

let knowledgeIndexPromise;

const createArticleText = (article) => {
  return [
    article.title,
    article.category,
    article.content,
    article.tags.join(" "),
  ].join("\n");
};


 // Build the knowledge index by generating embeddings for all FAQ articles.
 // This is cached in memory and called only once.
 
const buildKnowledgeIndex = async () => {
  console.log("Building RAG knowledge index...");
  
  const articles = faqsData.articles;
  const index = [];

  for (const article of articles) {
    const articleText = createArticleText(article);
    
    try {
      const embedding = await createEmbedding(articleText);
      
      index.push({
        id: article.id,
        title: article.title,
        category: article.category,
        content: article.content,
        tags: article.tags,
        embedding,
        articleText,
      });
    } catch (error) {
      console.error(
        `Failed to embed FAQ article ${article.id}:`,
        error
      );
      throw error;
    }
  }

  console.log(`RAG knowledge index built with ${index.length} articles`);
  return index;
};


const getKnowledgeIndex = () => {
  if (!knowledgeIndexPromise) {
    knowledgeIndexPromise = buildKnowledgeIndex();
  }

  return knowledgeIndexPromise;
};


const cosineSimilarity = (vectorA, vectorB) => {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vector dimensions must match");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

export const warmKnowledgeBase = async () => {
  try {
    await getKnowledgeIndex();
    console.log("ShopEase RAG knowledge base is ready");
  } catch (error) {
    console.error("Failed to warm ShopEase RAG knowledge base:", error);
    throw error;
  }
};


export const searchRelevantArticles = async (
  query,
  { limit = 3, minScore = 0.28 } = {}
) => {
  if (!query || typeof query !== "string" || !query.trim()) {
    throw new Error("KNOWLEDGE_QUERY_REQUIRED");
  }

  try {
    const index = await getKnowledgeIndex();

    const queryEmbedding = await createEmbedding(query);

    const results = index
      .map((article) => {
        const score = cosineSimilarity(
          queryEmbedding,
          article.embedding
        );

        return {
          id: article.id,
          title: article.title,
          category: article.category,
          content: article.content,
          tags: article.tags,
          source: "shopease-faq",
          score,
        };
      })
      .filter((result) => result.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    throw error;
  }
};
