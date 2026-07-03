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

export function addMessageService(sessionId, content, role = "user") {
  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  const message = {
    id: uuidv4(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };

  const updatedSession = {
    ...session,
    updatedAt: new Date().toISOString(),
    messages: [...session.messages, message],
  };

  sessions.set(sessionId, updatedSession);

  return updatedSession;
}

