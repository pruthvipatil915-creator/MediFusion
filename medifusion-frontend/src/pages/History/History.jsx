import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaHeartPulse, FaMagnifyingGlass, FaFilter, FaStethoscope } from "react-icons/fa6";
import "./History.css";

import { getPredictionHistory } from "../../services/historyService";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getPredictionHistory();
      setHistory(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "badge-risk-high";
      case "medium":
        return "badge-risk-medium";
      case "low":
        return "badge-risk-low";
      default:
        return "bg-secondary text-white";
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        (item.diseaseName && item.diseaseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.specialistDoctor && item.specialistDoctor.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRisk =
        riskFilter === "ALL" ||
        (item.riskLevel && item.riskLevel.toUpperCase() === riskFilter);

      return matchSearch && matchRisk;
    });
  }, [history, searchQuery, riskFilter]);

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-cyan" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Loading prediction history...</h5>
      </div>
    );
  }

  return (
    <div className="container history-container my-5 fade-in">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-1.5 rounded-pill fw-semibold mb-2 d-inline-flex align-items-center gap-2">
            <FaClock /> Personal Clinical Record
          </span>
          <h1 className="fw-bold text-white display-6 mb-1">
            Prediction History
          </h1>
          <p className="text-muted small mb-0">
            Review your past AI health assessments and specialist recommendations.
          </p>
        </div>

        <button
          className="btn btn-primary-glow btn-sm d-flex align-items-center gap-2"
          onClick={() => navigate("/prediction")}
        >
          <FaHeartPulse /> <span>New Prediction</span>
        </button>
      </div>

      {/* Controls Bar: Search & Risk Filter */}
      <div className="glass-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                <FaMagnifyingGlass />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by disease or specialist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end gap-2">
            <FaFilter className="text-muted small" />
            <span className="small text-muted fw-semibold">Risk Level:</span>
            <select
              className="form-select form-select-sm w-auto"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="ALL">All Risks</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table Container */}
      <div className="history-table-wrapper">
        {filteredHistory.length === 0 ? (
          <div className="text-center p-5">
            <div className="mb-3 text-muted">
              <FaClock style={{ fontSize: '3rem', opacity: 0.4 }} />
            </div>
            <h4 className="fw-bold text-white mb-2">No Prediction History Found</h4>
            <p className="text-muted max-w-md mx-auto mb-4">
              {searchQuery || riskFilter !== "ALL"
                ? "No prediction records match your active search filters."
                : "You haven't run any AI disease predictions yet."}
            </p>
            <button
              className="btn btn-primary-glow"
              onClick={() => navigate("/prediction")}
            >
              Start Your First Prediction
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table history-table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Condition</th>
                  <th>Risk Level</th>
                  <th>Recommended Specialist</th>
                  <th>Timestamp</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="text-muted small">#{index + 1}</td>
                    <td className="fw-bold text-white">{item.diseaseName}</td>
                    <td>
                      <span className={`badge-status ${getRiskBadgeClass(item.riskLevel)}`}>
                        {item.riskLevel || "Standard"}
                      </span>
                    </td>
                    <td className="text-cyan font-medium">
                      {item.specialistDoctor || "General Physician"}
                    </td>
                    <td className="text-muted small">
                      {item.predictionDate
                        ? new Date(item.predictionDate).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary-glow py-1 px-2.5"
                        onClick={() =>
                          navigate("/hospitals", {
                            state: { specialization: item.specialistDoctor },
                          })
                        }
                      >
                        <FaStethoscope className="me-1" /> Find Doctor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;