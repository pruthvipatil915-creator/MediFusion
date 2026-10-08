import React from "react";
import { FaInbox } from "react-icons/fa6";
import "./EmptyState.css";

function EmptyState({
  icon = <FaInbox />,
  title = "No Data Found",
  description = "There are no records to display at this time.",
  actionText,
  onAction,
  className = "",
}) {
  return (
    <div className={`empty-state-wrapper text-center p-5 ${className}`}>
      <div className="empty-state-icon mb-3">{icon}</div>
      <h4 className="fw-bold text-white mb-2">{title}</h4>
      <p className="text-muted small max-w-md mx-auto mb-4">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          className="btn btn-primary-glow px-4 py-2"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
