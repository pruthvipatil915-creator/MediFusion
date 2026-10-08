import React from "react";
import "./GlassCard.css";

function GlassCard({ children, className = "", hoverGlow = true, ...props }) {
  return (
    <div
      className={`glass-card ${hoverGlow ? "glass-card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
