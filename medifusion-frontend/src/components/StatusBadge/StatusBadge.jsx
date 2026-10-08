import React from "react";
import "./StatusBadge.css";

function StatusBadge({ status, type = "default", icon, className = "" }) {
  const getBadgeTypeClass = () => {
    const s = String(status || type).toLowerCase();
    if (s.includes("high") || s.includes("cancel") || s.includes("danger") || s.includes("reject")) {
      return "status-badge-danger";
    }
    if (s.includes("medium") || s.includes("warn") || s.includes("pending") || s.includes("upcoming") || s.includes("booked") || s.includes("schedule")) {
      return "status-badge-warning";
    }
    if (s.includes("low") || s.includes("complete") || s.includes("success") || s.includes("confirm") || s.includes("active")) {
      return "status-badge-success";
    }
    if (s.includes("info") || s.includes("admin") || s.includes("specialist")) {
      return "status-badge-info";
    }
    return "status-badge-default";
  };

  return (
    <span className={`status-badge ${getBadgeTypeClass()} ${className}`}>
      {icon && <span className="status-badge-icon me-1">{icon}</span>}
      <span>{status}</span>
    </span>
  );
}

export default StatusBadge;
