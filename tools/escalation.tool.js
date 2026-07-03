import { v4 as uuidv4 } from "uuid";

const escalations = [];

export const escalateToHuman = (summary, priority = "normal") => {
  const cleanSummary = String(summary ?? "").trim();
  const cleanPriority = String(priority ?? "normal").trim().toLowerCase();

  if (!cleanSummary) {
    return {
      created: false,
      message: "Summary is required",
    };
  }

  const ticketId = `ESC-${uuidv4().split("-")[0].toUpperCase()}`;

  const ticket = {
    ticketId,
    summary: cleanSummary,
    priority: cleanPriority || "normal",
    status: "open",
    createdAt: new Date().toISOString(),
  };

  escalations.push(ticket);

  return {
    created: true,
    ticketId,
    summary: ticket.summary,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    message: "Escalation created successfully",
  };
};

export const getEscalations = () => escalations;