import React, { useState } from "react";
import { FaRobot, FaMessage, FaXmark } from "react-icons/fa6";
import ChatWindow from "./ChatWindow";
import "./Chatbot.css";

function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  // Only render if user is logged in (or public if desired, but user wants it throughout authenticated app)
  if (!token) return null;

  return (
    <>
      <button
        type="button"
        className={`chatbot-fab-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="MediFusion AI Health Assistant"
        aria-label="Open AI Chatbot"
      >
        {isOpen ? <FaXmark /> : <FaRobot />}
        <span className="chatbot-fab-pulse"></span>
      </button>

      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default ChatbotButton;
