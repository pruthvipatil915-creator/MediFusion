import api from "./api";

/**
 * Send message to AI Chatbot via backend Gemini API
 * POST /api/chat
 * Payload: { message: string }
 * Response: { response: string }
 */
export const sendChatMessage = async (message) => {
  const response = await api.post("/chat", {
    message: message.trim(),
  });
  return response.data;
};

export default {
  sendChatMessage,
};
