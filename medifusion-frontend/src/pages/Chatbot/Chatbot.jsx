import React, { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../../services/chatbotService";
import {
  FaRobot,
  FaPaperPlane,
  FaShieldHeart,
  FaRotateRight,
  FaWandMagicSparkles,
  FaHeartPulse,
} from "react-icons/fa6";
import "../../components/Chatbot/Chatbot.css";

const QUICK_PROMPTS = [
  "Explain my disease prediction results",
  "What symptoms indicate high health risk?",
  "How do I schedule an appointment with a specialist?",
  "What foods boost immune health?",
  "Tips for maintaining healthy blood pressure",
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your MediFusion AI Clinical Assistant powered by Gemini. How can I assist your health and medical queries today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : inputMessage;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await sendChatMessage(userMsg.text);
      const replyText = response?.response || "I could not generate a response. Please try again.";

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chatbot Error:", err);
      const errorMsg =
        err?.response?.data?.message ||
        "The AI assistant is temporarily unavailable. Please verify your connection or try again.";

      const aiErrorMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: `⚠️ Error: ${errorMsg}`,
        isError: true,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiErrorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: "Conversation cleared. Ask me anything about healthcare, symptoms, or MediFusion features!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="container py-4 fade-in chatbot-page-wrapper">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-1.5 rounded-pill fw-semibold mb-2 d-inline-flex align-items-center gap-2">
            <FaRobot /> AI Clinical Guidance
          </span>
          <h1 className="fw-bold text-white display-6 mb-1">
            MediFusion AI Assistant
          </h1>
          <p className="text-muted small mb-0">
            Interactive healthcare intelligence powered by Gemini LLM.
          </p>
        </div>

        <button
          className="btn btn-secondary-glow btn-sm d-flex align-items-center gap-2"
          onClick={handleClearChat}
        >
          <FaRotateRight /> <span>Clear Conversation</span>
        </button>
      </div>

      {/* Main Chat Glass Card */}
      <div
        className="glass-card p-0 overflow-hidden d-flex flex-column"
        style={{ height: "650px" }}
      >
        {/* Safety Disclaimer Banner */}
        <div className="chatbot-safety-banner d-flex align-items-center gap-2">
          <FaShieldHeart className="text-warning flex-shrink-0 fs-6" />
          <span>
            <strong>Medical Notice:</strong> MediFusion AI Assistant provides general health information and does not replace professional medical diagnosis or clinical care.
          </span>
        </div>

        {/* Chat Messages */}
        <div className="chatbot-messages p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chatbot-message-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
            >
              <div
                className={`chatbot-msg-bubble ${
                  msg.sender === "user" ? "user-bubble" : "ai-bubble"
                } ${msg.isError ? "error-bubble" : ""}`}
                style={{ maxWidth: "75%" }}
              >
                <div className="chatbot-msg-text" style={{ whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </div>
                <div className="chatbot-msg-time">{msg.time}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chatbot-message-row ai-row">
              <div className="chatbot-msg-bubble ai-bubble typing-indicator-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <small className="text-muted ms-2" style={{ fontSize: "0.75rem" }}>
                  Analyzing query...
                </small>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="chatbot-quick-prompts px-4 py-2">
          <div className="d-flex align-items-center gap-1 text-muted small mb-1.5" style={{ fontSize: "0.75rem" }}>
            <FaWandMagicSparkles className="text-cyan" /> <span>Suggested inquiries:</span>
          </div>
          <div className="quick-prompts-scroll">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-prompt-chip"
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          className="chatbot-input-bar p-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            className="form-control chatbot-input shadow-none"
            placeholder="Type your healthcare or platform question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary-glow px-4 d-flex align-items-center gap-2"
            disabled={!inputMessage.trim() || loading}
          >
            <FaPaperPlane /> <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
