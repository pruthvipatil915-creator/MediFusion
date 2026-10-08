import { Link } from "react-router-dom";
import { FaHeartPulse } from "react-icons/fa6";
import { FiShield, FiCheckCircle } from "react-icons/fi";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-dark mt-5">
      <div className="container">
        <div className="row g-4 mb-4">

          {/* Column 1: Brand & Overview */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px', fontSize: '0.95rem' }}>
                <FaHeartPulse />
              </div>
              <span className="footer-brand">MediFusion AI</span>
            </div>
            <p className="small text-muted leading-relaxed">
              Empowering proactive personal wellness through AI-assisted disease prediction, specialist doctor discovery, and seamless medical appointment scheduling.
            </p>
            <div className="d-flex align-items-center gap-2 text-info small">
              <FiShield /> <span>HIPAA-Compliant Security Architecture</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 footer-link-group">
            <h6>Navigation</h6>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/prediction" className="footer-link">AI Prediction</Link>
            <Link to="/hospitals" className="footer-link">Find Doctors</Link>
            <Link to="/my-appointments" className="footer-link">My Appointments</Link>
          </div>

          {/* Column 3: Platform Features */}
          <div className="col-lg-2 col-md-6 footer-link-group">
            <h6>Platform</h6>
            <span className="footer-link">RandomForest AI</span>
            <span className="footer-link">Symptom Mapping</span>
            <span className="footer-link">Risk Assessment</span>
            <span className="footer-link">Specialist Guidance</span>
          </div>

          {/* Column 4: Medical Disclaimer */}
          <div className="col-lg-4 col-md-6">
            <div className="disclaimer-box">
              <div className="fw-semibold text-warning mb-1 d-flex align-items-center gap-1">
                <FiCheckCircle /> Medical Disclaimer
              </div>
              <p className="mb-0">
                MediFusion AI predictions are generated for informational purposes only and do not replace professional medical advice, diagnosis, or treatment. Always consult a qualified physician for any health concerns.
              </p>
            </div>
          </div>

        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-muted">
          <div>
            © 2026 MediFusion AI. All rights reserved.
          </div>
          <div className="d-flex gap-3">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;