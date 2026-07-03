import { Router } from "express";
import { createSession, getSessionById } from "../controllers/sessionController.js";

const router = Router();

router.post("/", createSession);

router.get("/:sessionId", getSessionById);


export default router;
