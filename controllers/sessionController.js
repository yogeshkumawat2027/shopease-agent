import {  createSessionService } from "../services/sessionService.js";

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
