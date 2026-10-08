import { FaHeartPulse } from "react-icons/fa6";

function WelcomeCard({ userName }) {
  return (
    <div className="welcome-hero-card mb-4">
      <div className="row align-items-center">
        <div className="col-lg-8">
          <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-1.5 rounded-pill mb-3 fw-semibold d-inline-flex align-items-center gap-2">
            <FaHeartPulse /> Personal Healthcare Hub
          </span>
          <h1 className="display-6 fw-bold text-white mb-2">
            Welcome back, {userName || "Patient"} 👋
          </h1>
          <p className="text-muted leading-relaxed mb-0">
            Monitor your symptom prediction history, explore specialist doctors in your area, and schedule medical visits seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;