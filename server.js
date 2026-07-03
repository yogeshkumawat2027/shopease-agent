import express from "express";
import dotenv from "dotenv";
import sessionRoutes from "./routes/sessionRoutes.js";
import testRoutes from "./routes/testroutes.js";
import groq from "./services/groq.service.js";

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
app.use("/test", testRoutes);

app.get("/health", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY || !process.env.MODEL) {
      return res.status(503).json({
        status: "error",
        message: "LLM configuration is missing",
      });
    }

    await groq.models.list();

    return res.json({
      status: "ok",
    });
  } catch (error) {
    return res.status(503).json({
      status: "error",
      message: "LLM API is not reachable",
    });
  }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});