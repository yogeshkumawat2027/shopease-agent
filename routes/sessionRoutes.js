import { Router } from "express";
import { sendChatMessage, createSession, getChatHistory } from "../controllers/sessionController.js";

const router = Router();

router.post("/", createSession);
router.get("/:sessionId/chat", getChatHistory);
router.post("/:sessionId/chat", sendChatMessage);


export default router;
