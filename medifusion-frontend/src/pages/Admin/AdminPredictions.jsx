import React, { useState, useEffect } from "react";
import { getPredictionHistory } from "../../services/historyService";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import {
  FaChartLine,
  FaHeartPulse,
  FaTriangleExclamation,
  FaShieldHeart,
  FaRobot,
  FaStethoscope,
} from "react-icons/fa6";

function AdminPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const data = await getPredictionHistory();
      setPredictions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load prediction analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const highRiskCount = predictions.filter(
    (p) => p.riskLevel && p.riskLevel.toUpperCase() === "HIGH"
  ).length;

  const mediumRiskCount = predictions.filter(
    (p) => p.riskLevel && p.riskLevel.toUpperCase() === "MEDIUM"
  ).length;

  const lowRiskCount = predictions.filter(
    (p) => p.riskLevel && p.riskLevel.toUpperCase() === "LOW"
  ).length;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1 font-heading d-flex align-items-center gap-2">
            <FaChartLine className="text-cyan" /> AI Prediction Analytics
          </h2>
          <p className="text-muted small mb-0">
            Clinical machine learning diagnostics, symptom correlation metrics, and risk tier distribution.
          </p>
        </div>

        <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-2 rounded-pill">
          RandomForest ML Model
        </span>
      </div>

      {/* Analytics Metric Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Total Analyzed</span>
              <FaHeartPulse className="text-primary fs-5" />
            </div>
            <h3 className="fw-bold text-white mb-0">{predictions.length}</h3>
            <small className="text-muted">Clinical Inferences</small>
          </GlassCard>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">High Risk Cases</span>
              <FaTriangleExclamation className="text-danger fs-5" />
            </div>
            <h3 className="fw-bold text-danger mb-0">{highRiskCount}</h3>
            <small className="text-danger-emphasis">Urgent Medical Triage</small>
          </GlassCard>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Medium Risk Cases</span>
              <FaShieldHeart className="text-warning fs-5" />
            </div>
            <h3 className="fw-bold text-warning mb-0">{mediumRiskCount}</h3>
            <small className="text-warning-emphasis">Monitoring Recommended</small>
          </GlassCard>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Low Risk Cases</span>
              <FaRobot className="text-success fs-5" />
            </div>
            <h3 className="fw-bold text-success mb-0">{lowRiskCount}</h3>
            <small className="text-success-emphasis">Standard / Minor</small>
          </GlassCard>
        </div>
      </div>

      {/* Model Diagnostic Overview & Recent Predictions */}
      <div className="row g-4">
        {/* Risk Distribution Breakdown */}
        <div className="col-lg-5">
          <GlassCard className="p-4 h-100">
            <h5 className="fw-bold text-white mb-3 font-heading">
              Risk Stratification Breakdown
            </h5>

            <div className="d-flex flex-column gap-3">
              {/* High Risk Bar */}
              <div>
                <div className="d-flex justify-content-between text-muted small mb-1">
                  <span className="text-danger fw-semibold">High Risk</span>
                  <span>
                    {predictions.length > 0
                      ? `${Math.round((highRiskCount / predictions.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
                <div className="progress bg-dark" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{
                      width: predictions.length > 0 ? `${(highRiskCount / predictions.length) * 100}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Medium Risk Bar */}
              <div>
                <div className="d-flex justify-content-between text-muted small mb-1">
                  <span className="text-warning fw-semibold">Medium Risk</span>
                  <span>
                    {predictions.length > 0
                      ? `${Math.round((mediumRiskCount / predictions.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
                <div className="progress bg-dark" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{
                      width: predictions.length > 0 ? `${(mediumRiskCount / predictions.length) * 100}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Low Risk Bar */}
              <div>
                <div className="d-flex justify-content-between text-muted small mb-1">
                  <span className="text-success fw-semibold">Low Risk</span>
                  <span>
                    {predictions.length > 0
                      ? `${Math.round((lowRiskCount / predictions.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
                <div className="progress bg-dark" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width: predictions.length > 0 ? `${(lowRiskCount / predictions.length) * 100}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <hr className="border-secondary border-opacity-25 my-4" />

            <div className="p-3 rounded bg-dark border border-secondary border-opacity-25">
              <h6 className="fw-bold text-white mb-1 small">Model Architecture</h6>
              <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>
                Ensemble Decision Trees (RandomForest) trained with multi-symptom binary matrix representation.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Prediction Logs List */}
        <div className="col-lg-7">
          <GlassCard className="p-4 h-100">
            <h5 className="fw-bold text-white mb-3 font-heading">
              Recent Prediction Inferences
            </h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-cyan"></div>
              </div>
            ) : predictions.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                No prediction inferences logged in this session yet.
              </div>
            ) : (
              <div className="d-flex flex-column gap-2.5">
                {predictions.slice(0, 6).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded bg-dark border border-secondary border-opacity-25 d-flex align-items-center justify-content-between"
                  >
                    <div>
                      <div className="fw-bold text-white">{item.diseaseName}</div>
                      <small className="text-muted d-flex align-items-center gap-1">
                        <FaStethoscope className="text-cyan" /> {item.specialistDoctor || "General Physician"}
                      </small>
                    </div>

                    <div className="text-end">
                      <StatusBadge status={item.riskLevel || "LOW"} />
                      <div className="text-muted small mt-1" style={{ fontSize: "0.7rem" }}>
                        {item.predictionDate
                          ? new Date(item.predictionDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })
                          : "Today"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default AdminPredictions;
