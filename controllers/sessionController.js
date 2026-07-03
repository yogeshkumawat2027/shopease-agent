import { addMessageService, createSessionService, getSessionByIdService } from "../services/sessionService.js";

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

export function getSessionById(req, res) {
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

export function addMessage(req, res) {
	const { sessionId } = req.params;
	const { message, content, role } = req.body;
	const text = message ?? content;

	if (!text || !String(text).trim()) {
		return res.status(400).json({
			success: false,
			message: "Message content is required",
		});
	}

	const updatedSession = addMessageService(sessionId, String(text).trim(), role);

	if (!updatedSession) {
		return res.status(404).json({
			success: false,
			message: "Session not found",
		});
	}

	return res.status(201).json({
		success: true,
		message: "Message added successfully",
		data: {
			session: updatedSession,
		},
	});
}
