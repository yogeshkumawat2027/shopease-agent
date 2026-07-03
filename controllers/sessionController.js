import { addMessageService, createSessionService, getSessionByIdService } from "../services/sessionService.js";
import { runAgent } from "../services/agent.service.js";

export function createSession(req, res) {
	const session = createSessionService();

	return res.status(201).json({
		success: true,
		message: "Session created successfully",
		data: {
			session,
		},
	});
}

export function getChatHistory(req, res) {  //get all sessions by sessionid
	const { sessionId } = req.params;
	const session = getSessionByIdService(sessionId);

	if (!session) {
		return res.status(404).json({
			success: false,
			message: "Session not found",
		});
	}

	return res.status(200).json({
		success: true,
		message: "Session fetched successfully",
		data: {
			session,
		},
	});
}

export async function sendChatMessage(req, res) {
  try {
    const { sessionId } = req.params;
    const { message, content } = req.body;
    const text = message ?? content;

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const session = getSessionByIdService(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    addMessageService(sessionId, String(text).trim(), "user");

    const updatedUserSession = getSessionByIdService(sessionId);

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AGENT_TIMEOUT")), 30000);
    });

    const reply = await Promise.race([
      runAgent(updatedUserSession.messages),
      timeoutPromise,
    ]);

    addMessageService(sessionId, String(reply).trim(), "assistant");

    const updatedSession = getSessionByIdService(sessionId);

    return res.status(200).json({
      success: true,
      message: "Agent replied successfully",
      data: {
        reply,
        session: updatedSession,
      },
    });
  } catch (error) {
    if (error.message === "AGENT_TIMEOUT") {
      return res.status(504).json({
        success: false,
        message: "The agent took too long to respond. Please try again.",
      });
    }

    return res.status(503).json({
      success: false,
      message: "I'm having trouble right now. Please try again.",
    });
  }
}