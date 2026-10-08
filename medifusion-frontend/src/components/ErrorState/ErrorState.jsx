import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import "./ErrorState.css";

function ErrorState({
  title = "Something Went Wrong",
  message = "Failed to load data from the server. Please check your connection and try again.",
  onRetry,
  className = "",
}) {
  return (
    <div className={`error-state-wrapper text-center p-5 ${className}`}>
      <div className="error-state-icon mb-3">
        <FaTriangleExclamation />
      </div>
      <h4 className="fw-bold text-white mb-2">{title}</h4>
      <p className="text-danger-emphasis small max-w-md mx-auto mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          className="btn btn-outline-danger btn-sm px-4 py-2 d-inline-flex align-items-center gap-2"
          onClick={onRetry}
        >
          <FiRefreshCw /> <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export default ErrorState;
