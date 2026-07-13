export const tools = [
  {
    type: "function",
    function: {
      name: "search_knowledge_base",
      description:
        "Retrieve relevant ShopEase policy and FAQ information for general questions about shipping, delivery, returns, refunds, cancellations, warranty, payments, accounts, and support. Do not use this tool for a specific order status or order-specific refund eligibility.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "A complete standalone search query preserving the customer's product, issue, and policy-related details.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_status",
      description:
        "Look up a ShopEase order by order ID and return status, delivery, tracking, items, and payment details.",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "Order ID like ORD-1001",
          },
        },
        required: ["order_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_refund_eligibility",
      description:
        "Check whether a ShopEase order is eligible for refund based on order status and delivery date.",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "Order ID like ORD-1001",
          },
        },
        required: ["order_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "escalate_to_human",
      description:
        "Create a human support ticket when the AI cannot resolve the customer's issue.",
      parameters: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "Short summary of the customer issue",
          },
          priority: {
            type: "string",
            enum: ["low", "normal", "high"],
            description: "Escalation priority",
          },
        },
        required: ["summary", "priority"],
        additionalProperties: false,
      },
    },
  },
];