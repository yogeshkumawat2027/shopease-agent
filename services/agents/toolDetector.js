export const detectTool = (message) => {
  const text = message.toLowerCase();

  const orderMatch = message.match(/ORD-\d+/i);
  const orderId = orderMatch?.[0]?.toUpperCase();

  if (
    text.includes("human") ||
    text.includes("agent") ||
    text.includes("representative")
  ) {
    return {
      name: "escalate_to_human",
      args: {
        summary: message,
        priority: "normal",
      },
    };
  }

  if (text.includes("refund")) {
    if (!orderId) return null;

    return {
      name: "check_refund_eligibility",
      args: {
        order_id: orderId,
      },
    };
  }

  if (
    text.includes("order") ||
    text.includes("tracking") ||
    text.includes("where is")
  ) {
    if (!orderId) return null;

    return {
      name: "get_order_status",
      args: {
        order_id: orderId,
      },
    };
  }

  return {
    name: "search_knowledge_base",
    args: {
      query: message,
    },
  };
};