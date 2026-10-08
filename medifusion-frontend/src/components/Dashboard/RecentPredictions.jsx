import { FaHeartPulse, FaCalendarDay } from "react-icons/fa6";

function RecentPredictions({ latestPrediction, latestPredictionDate }) {
  return (
    <div className="glass-card p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-3">
        <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
          <FaHeartPulse className="text-cyan" /> Latest Prediction Report
        </h5>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill small">
          AI Engine
        </span>
      </div>

      <div className="py-2">
        <div className="mb-3">
          <span className="text-muted small d-block mb-1">Identified Condition</span>
          <h4 className="fw-bold text-white mb-0">
            {latestPrediction || "No Prediction Yet"}
          </h4>
        </div>

        <div>
          <span className="text-muted small d-block mb-1">Timestamp</span>
          <p className="text-secondary small mb-0 d-flex align-items-center gap-2">
            <FaCalendarDay className="text-primary" />
            {latestPredictionDate
              ? new Date(latestPredictionDate).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecentPredictions;