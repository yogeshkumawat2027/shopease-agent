import { searchRelevantArticles } from "../services/rag.service.js";

export const searchKnowledgeBase = async (query) => {
  console.log("RAG query:", query);

  try {
    const results = await searchRelevantArticles(query, {
      limit: 3,
      minScore: 0.2,
    });

    console.log(
      "RAG results:",
      results.map((item) => ({
        id: item.id,
        title: item.title,
        score: item.score,
      }))
    );

    if (results.length === 0) {
      return {
        success: true,
        found: false,
        query,
        message:
          "No sufficiently relevant ShopEase policy or FAQ article was found.",
        results: [],
      };
    }

    return {
      success: true,
      found: true,
      query,
      results,
    };
  } catch (error) {
    console.error("RAG search failed:", error);

    return {
      success: false,
      found: false,
      query,
      error: "KNOWLEDGE_SEARCH_FAILED",
      message: "Knowledge-base search failed.",
      results: [],
    };
  }
};