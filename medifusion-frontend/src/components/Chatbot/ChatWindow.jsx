import React, { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../../services/chatbotService";
import {
  FaRobot,
  FaPaperPlane,
  FaXmark,
  FaShieldHeart,
  FaRotateRight,
  FaUser,
  FaWandMagicSparkles,
  FaCircleInfo,
} from "react-icons/fa6";
import "./Chatbot.css";

const QUICK_PROMPTS = [
  "Explain my disease prediction results",
  "What symptoms indicate high health risk?",
  "How do I schedule an appointment with a specialist?",
  "Tips for maintaining cardiovascular health",
];

function ChatWindow({ isOpen, onClose, initialMessage }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your MediFusion AI Health Assistant. How can I help you understand symptoms, specialists, or platform features today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

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
    setError(null);

    try {
      const response = await sendChatMessage(userMsg.text);
      const replyText = response?.response || "I apologize, but I could not generate a response. Please try again.";

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chatbot message error:", err);
      const errorMsg =
        err?.response?.data?.message ||
        "The AI assistant is temporarily unavailable. Please verify your connection or try again shortly.";
      setError(errorMsg);

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
        text: "Chat cleared. Feel free to ask any health or platform question!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-window-wrapper fade-in">
      {/* Header */}
      <div className="chatbot-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="chatbot-avatar-header">
            <FaRobot />
          </div>
          <div>
            <h6 className="mb-0 fw-bold text-white d-flex align-items-center gap-1.5 font-heading">
              <span>MediFusion Assistant</span>
              <span className="badge bg-primary-subtle text-cyan border border-primary-subtle rounded-pill py-0.5 px-1.5 small" style={{ fontSize: '0.65rem' }}>
                AI Gemini
              </span>
            </h6>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Healthcare Guidance Assistant
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-icon text-muted hover-text-white"
            onClick={handleClearChat}
            title="Clear Chat History"
          >
            <FaRotateRight />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-icon text-muted hover-text-white"
            onClick={onClose}
            aria-label="Close"
          >
            <FaXmark />
          </button>
        </div>
      </div>

      {/* Medical Safety Disclaimer Banner */}
      <div className="chatbot-safety-banner d-flex align-items-center gap-2">
        <FaShieldHeart className="text-warning flex-shrink-0" />
        <span>
          For informational purposes only. In medical emergencies, seek immediate emergency clinical care.
        </span>
      </div>

      {/* Messages Area */}
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chatbot-message-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
          >
            <div className={`chatbot-msg-bubble ${msg.sender === "user" ? "user-bubble" : "ai-bubble"} ${msg.isError ? "error-bubble" : ""}`}>
              <div className="chatbot-msg-text">{msg.text}</div>
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
                AI is thinking...
              </small>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="chatbot-quick-prompts">
        <div className="d-flex align-items-center gap-1 text-muted small mb-1.5" style={{ fontSize: "0.75rem" }}>
          <FaWandMagicSparkles className="text-cyan" /> <span>Suggested prompts:</span>
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

      {/* Input Box */}
      <form
        className="chatbot-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          className="form-control chatbot-input shadow-none"
          placeholder="Ask a health or platform question..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary-glow btn-sm chatbot-send-btn"
          disabled={!inputMessage.trim() || loading}
          title="Send Message"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
