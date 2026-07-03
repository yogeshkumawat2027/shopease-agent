import express from "express";
import dotenv from "dotenv";
import sessionRoutes from "./routes/sessionRoutes.js";

import { searchKnowledgeBase } from "./tools/knowledge.tool.js";
import { checkRefundEligibility } from "./tools/refund.tool.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopEase AI Agent API is running",
  });
});

app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});


app.get("/test/refund/:orderId", (req, res) => {
  const result = checkRefundEligibility(req.params.orderId);

  res.json({
    success: true,
    data: result,
  });
});


// app.get("/test/order/:orderId", (req, res) => {              //test to order status is working or not
//   const result = getOrderStatus(req.params.orderId);

//   res.json({
//     success: true,
//     data: result,
//   });
// });

// app.get("/test/faq/:query", (req, res) => {
//   const result = searchKnowledgeBase(req.params.query);
//   res.json(result);
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});