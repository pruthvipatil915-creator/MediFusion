import React from "react";
import { FaCircleCheck, FaTriangleExclamation, FaCircleXmark, FaCircleInfo } from "react-icons/fa6";
import "./Toast.css";

function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCircleCheck className="toast-icon text-success" />;
      case "error":
      case "danger":
        return <FaCircleXmark className="toast-icon text-danger" />;
      case "warning":
        return <FaTriangleExclamation className="toast-icon text-warning" />;
      default:
        return <FaCircleInfo className="toast-icon text-info" />;
    }
  };

  return (
    <div className="toast-floating-container">
      <div className={`toast-card toast-${type} fade-in`}>
        <div className="toast-content d-flex align-items-center gap-2">
          {getIcon()}
          <span className="toast-message">{message}</span>
        </div>
        {onClose && (
          <button
            type="button"
            className="toast-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;
