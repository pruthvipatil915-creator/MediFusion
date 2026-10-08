import { Link } from "react-router-dom";
import { FaHeartPulse, FaStethoscope, FaCalendarCheck, FaClock } from "react-icons/fa6";

function QuickActions() {
  return (
    <div className="row g-3 mb-4">
      <div className="col-6 col-md-3">
        <Link to="/prediction" className="quick-action-btn">
          <div className="quick-action-icon">
            <FaHeartPulse />
          </div>
          <span className="fw-semibold small">Predict Disease</span>
        </Link>
      </div>

      <div className="col-6 col-md-3">
        <Link to="/hospitals" className="quick-action-btn">
          <div className="quick-action-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            <FaStethoscope />
          </div>
          <span className="fw-semibold small">Find Doctors</span>
        </Link>
      </div>

      <div className="col-6 col-md-3">
        <Link to="/my-appointments" className="quick-action-btn">
          <div className="quick-action-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <FaCalendarCheck />
          </div>
          <span className="fw-semibold small">My Appointments</span>
        </Link>
      </div>

      <div className="col-6 col-md-3">
        <Link to="/history" className="quick-action-btn">
          <div className="quick-action-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
            <FaClock />
          </div>
          <span className="fw-semibold small">View History</span>
        </Link>
      </div>
    </div>
  );
}

export default QuickActions;