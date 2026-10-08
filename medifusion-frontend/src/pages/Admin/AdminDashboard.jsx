import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../services/adminService";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import {
  FaUserDoctor,
  FaHospital,
  FaCalendarCheck,
  FaHeartPulse,
  FaClockRotateLeft,
  FaArrowRight,
  FaShieldHalved,
  FaUserGroup,
} from "react-icons/fa6";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-cyan" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted small">Loading platform analytics...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1.5 rounded-pill fw-semibold mb-2 d-inline-flex align-items-center gap-2">
            <FaShieldHalved /> System Administration
          </span>
          <h2 className="fw-bold text-white mb-1 font-heading">
            Platform Overview
          </h2>
          <p className="text-muted small mb-0">
            Real-time infrastructure metrics and clinical management stats.
          </p>
        </div>

        <button className="btn btn-secondary-glow btn-sm" onClick={fetchStats}>
          <FaClockRotateLeft className="me-1" /> Refresh Data
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="row g-4 mb-4">
        {/* Doctors Stat */}
        <div className="col-12 col-sm-6 col-xl-3">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">Total Doctors</span>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#3b82f6",
                }}
              >
                <FaUserDoctor className="fs-5" />
              </div>
            </div>
            <h3 className="fw-bold text-white mb-1">{stats?.totalDoctors ?? 0}</h3>
            <div className="d-flex align-items-center justify-content-between">
              <small className="text-cyan">Licensed Specialists</small>
              <Link to="/admin/doctors" className="small text-muted text-decoration-none">
                Manage &rarr;
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Hospitals Stat */}
        <div className="col-12 col-sm-6 col-xl-3">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">Total Hospitals</span>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "rgba(6, 182, 212, 0.15)",
                  color: "#06b6d4",
                }}
              >
                <FaHospital className="fs-5" />
              </div>
            </div>
            <h3 className="fw-bold text-white mb-1">{stats?.totalHospitals ?? 0}</h3>
            <div className="d-flex align-items-center justify-content-between">
              <small className="text-cyan">Registered Facilities</small>
              <Link to="/admin/hospitals" className="small text-muted text-decoration-none">
                Manage &rarr;
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Total Appointments */}
        <div className="col-12 col-sm-6 col-xl-3">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">Appointments</span>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                }}
              >
                <FaCalendarCheck className="fs-5" />
              </div>
            </div>
            <h3 className="fw-bold text-white mb-1">{stats?.totalAppointments ?? 0}</h3>
            <div className="d-flex align-items-center justify-content-between">
              <small className="text-warning">All Scheduled & Logged</small>
              <Link to="/admin/appointments" className="small text-muted text-decoration-none">
                Manage &rarr;
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Upcoming Appointments */}
        <div className="col-12 col-sm-6 col-xl-3">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-semibold">Upcoming Visits</span>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                }}
              >
                <FaCalendarCheck className="fs-5" />
              </div>
            </div>
            <h3 className="fw-bold text-white mb-1">{stats?.upcomingAppointments ?? 0}</h3>
            <div className="d-flex align-items-center justify-content-between">
              <small className="text-success">Active Bookings</small>
              <StatusBadge status="ACTIVE" type="success" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Admin Actions & Status Grid */}
      <div className="row g-4">
        <div className="col-lg-6">
          <GlassCard className="p-4 h-100">
            <h5 className="fw-bold text-white mb-3 font-heading">
              Administrative Quick Actions
            </h5>
            <div className="d-flex flex-column gap-2.5">
              <Link
                to="/admin/doctors"
                className="p-3 rounded bg-dark border border-secondary border-opacity-25 text-decoration-none d-flex align-items-center justify-content-between hover-glow"
              >
                <div className="d-flex align-items-center gap-3">
                  <FaUserDoctor className="text-primary fs-5" />
                  <div>
                    <h6 className="fw-bold text-white mb-0">Doctor Management</h6>
                    <small className="text-muted">Add, update, or remove specialist profiles</small>
                  </div>
                </div>
                <FaArrowRight className="text-muted" />
              </Link>

              <Link
                to="/admin/hospitals"
                className="p-3 rounded bg-dark border border-secondary border-opacity-25 text-decoration-none d-flex align-items-center justify-content-between hover-glow"
              >
                <div className="d-flex align-items-center gap-3">
                  <FaHospital className="text-cyan fs-5" />
                  <div>
                    <h6 className="fw-bold text-white mb-0">Hospital Management</h6>
                    <small className="text-muted">Register medical centers and departments</small>
                  </div>
                </div>
                <FaArrowRight className="text-muted" />
              </Link>

              <Link
                to="/admin/appointments"
                className="p-3 rounded bg-dark border border-secondary border-opacity-25 text-decoration-none d-flex align-items-center justify-content-between hover-glow"
              >
                <div className="d-flex align-items-center gap-3">
                  <FaCalendarCheck className="text-warning fs-5" />
                  <div>
                    <h6 className="fw-bold text-white mb-0">Appointment Oversight</h6>
                    <small className="text-muted">Review booking logs, status, and cancellations</small>
                  </div>
                </div>
                <FaArrowRight className="text-muted" />
              </Link>
            </div>
          </GlassCard>
        </div>

        <div className="col-lg-6">
          <GlassCard className="p-4 h-100">
            <h5 className="fw-bold text-white mb-3 font-heading">
              System Architecture & Health
            </h5>
            <div className="p-3 rounded bg-dark border border-secondary border-opacity-25 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">Backend Service</span>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                  Spring Boot REST
                </span>
              </div>
              <small className="text-secondary d-block">Port: 8080 • JWT Stateless Security</small>
            </div>

            <div className="p-3 rounded bg-dark border border-secondary border-opacity-25 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">Machine Learning Service</span>
                <span className="badge bg-info-subtle text-cyan border border-info-subtle rounded-pill">
                  RandomForest Classifier
                </span>
              </div>
              <small className="text-secondary d-block">Port: 5000 • Flask Clinical Inference Engine</small>
            </div>

            <div className="p-3 rounded bg-dark border border-secondary border-opacity-25">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">AI Clinical Assistant</span>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                  Gemini API Gateway
                </span>
              </div>
              <small className="text-secondary d-block">Connected • Context-Aware Conversational Assistant</small>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
