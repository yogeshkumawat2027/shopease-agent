import { Router } from "express";
import dotenv from "dotenv";


import groq from "../services/groq.service.js";
dotenv.config();

import { getOrderStatus } from "../tools/order.tool.js";
import { searchKnowledgeBase } from "../tools/knowledge.tool.js";
import { checkRefundEligibility } from "../tools/refund.tool.js";
import { escalateToHuman } from "../tools/escalation.tool.js";



const router = Router();

router.get("/refund/:orderId", (req, res) => {
  const result = checkRefundEligibility(req.params.orderId);

  res.json({
    success: true,
    data: result,
  });
});

router.post("/escalate", (req, res) => {
  const { summary, priority } = req.body;
  const result = escalateToHuman(summary, priority);

  if (!result.created) {
    return res.status(400).json({
      success: false,
      data: result,
    });
  }

  return res.status(201).json({
    success: true,
    data: result,
  });
});

router.get("/order/:orderId", (req, res) => {              //test to order status is working or not
  const result = getOrderStatus(req.params.orderId);

  res.json({
    success: true,
    data: result,
  });
});

router.get("/faq/:query", (req, res) => {
  const result = searchKnowledgeBase(req.params.query);
  res.json(result);
});


router.get("/groq", async (req, res) => {
  try {
    const response = await groq.chat.completions.create({
      model: process.env.MODEL,
      messages: [
        {
          role: "user",
          content: "Say hello from Groq API",
        },
      ],
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/tool-test", async (req, res) => {
  const response = await groq.chat.completions.create({
    model: process.env.MODEL,
    messages: [
      {
        role: "user",
        content: "What is your return policy?",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "search_knowledge_base",
          description:
            "Search ShopEase FAQ articles.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
  });

  res.json(response);
});

export default router;