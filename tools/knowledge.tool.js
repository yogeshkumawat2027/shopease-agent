import faqsData from "../data/faqs.json" with { type: "json" };

export const searchKnowledgeBase = (query) => {
  const q = query.toLowerCase();

  const results = faqsData.articles.filter((article) => {
    const titleMatch =
      article.title.toLowerCase().includes(q);

    const contentMatch =
      article.content.toLowerCase().includes(q);

    const categoryMatch =
      article.category.toLowerCase().includes(q);

    const tagMatch = article.tags.some((tag) =>
      tag.toLowerCase().includes(q)
    );

    return (
      titleMatch ||
      contentMatch ||
      categoryMatch ||
      tagMatch
    );
  });

  return results.slice(0, 3);
};