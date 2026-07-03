import { Router } from "express";
import { addMessage, createSession, getSessionById } from "../controllers/sessionController.js";

const router = Router();

router.post("/", createSession);

router.get("/:sessionId", getSessionById);

router.post("/:sessionId/messages", addMessage);


export default router;
