import express from "express";
import dotenv from "dotenv";
import sessionRoutes from "./routes/sessionRoutes.js";

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});