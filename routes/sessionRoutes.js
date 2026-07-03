import { Router } from "express";
import { addMessage, createSession, getSessionById } from "../controllers/sessionController.js";

const router = Router();

router.post("/", createSession);
router.get("/:sessionId/chat", getSessionById);
router.post("/:sessionId/chat", addMessage);


export default router;
