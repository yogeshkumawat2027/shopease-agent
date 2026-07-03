export const buildConversationText = (history) => {
  return history
    .slice(-8)
    .map(
      (message) =>
        `${message.role.toUpperCase()}: ${message.content}`
    )
    .join("\n");
};