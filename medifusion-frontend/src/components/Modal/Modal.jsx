import React from "react";
import "./Modal.css";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="custom-modal-backdrop fade-in" onClick={onClose}></div>
      <div className="custom-modal-dialog-container" tabIndex="-1" role="dialog">
        <div className={`custom-modal-dialog modal-${size} fade-in`}>
          <div className="custom-modal-content">
            {/* Header */}
            <div className="custom-modal-header d-flex align-items-center justify-content-between">
              <h5 className="modal-title fw-bold text-white mb-0">{title}</h5>
              <button
                type="button"
                className="custom-modal-close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="custom-modal-body">{children}</div>

            {/* Footer */}
            {footer && <div className="custom-modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
