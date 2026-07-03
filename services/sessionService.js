import { v4 as uuidv4 } from "uuid";

const sessions = new Map();


export function createSessionService() {
  const session = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };

  sessions.set(session.id, session);

  return session;
}

export function getSessionByIdService(sessionId) {
	return sessions.get(sessionId) ?? null;
}

