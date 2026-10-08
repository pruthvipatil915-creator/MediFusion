import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import appointmentService from "../../services/appointmentService";
import api from "../../services/api";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import EmptyState from "../../components/EmptyState/EmptyState";
import {
  FaCalendarCheck,
  FaClock,
  FaHospital,
  FaUserDoctor,
  FaBan,
  FaMagnifyingGlass,
  FaFilter,
  FaClockRotateLeft,
  FaLocationDot,
  FaPhone,
  FaCircleInfo,
} from "react-icons/fa6";
import "./MyAppointments.css";

const parseDateTime = (dateStr, timeStr = "00:00") => {
  if (!dateStr) return new Date(0);
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = parseDateTime(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;

  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
};

function MyAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");

  // Cancel Modal State
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const isValidUserId = (id) => {
    return id !== null && id !== undefined && id !== "" && id !== "null" && id !== "undefined";
  };

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let activeUserId = localStorage.getItem("userId");

      // Fallback: resolve via profile if userId missing or invalid
      if (!isValidUserId(activeUserId)) {
        try {
          const profileRes = await api.get("/user/profile");
          if (profileRes.data && profileRes.data.id) {
            activeUserId = String(profileRes.data.id);
            localStorage.setItem("userId", activeUserId);
            if (profileRes.data.fullName) {
              localStorage.setItem("fullName", profileRes.data.fullName);
            }
          }
        } catch (profileErr) {
          console.error("Failed to resolve user profile:", profileErr);
        }
      }

      if (!isValidUserId(activeUserId)) {
        setError("Your session is unavailable. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await appointmentService.getAppointmentsByUser(activeUserId);
      const data = response?.data || response;
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to retrieve appointments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    setCancelling(true);

    try {
      await appointmentService.cancelAppointment(selectedAppointment.id);

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === selectedAppointment.id
            ? { ...app, status: "CANCELLED" }
            : app
        )
      );

      setSelectedAppointment(null);
      setToast({ message: "Appointment cancelled successfully!", type: "success" });
      fetchAppointments();
    } catch (error) {
      console.error("Cancellation failed:", error);
      setToast({
        message: error.response?.data?.message || "Unable to cancel appointment.",
        type: "error",
      });
    } finally {
      setCancelling(false);
    }
  };

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter(
      (a) => a.status === "UPCOMING" || a.status === "BOOKED" || a.status === "SCHEDULED"
    ).length;
    const completed = appointments.filter((a) => a.status === "COMPLETED").length;
    const cancelled = appointments.filter((a) => a.status === "CANCELLED").length;
    return { total, upcoming, completed, cancelled };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((app) => {
        if (activeTab === "UPCOMING") {
          return app.status === "UPCOMING" || app.status === "BOOKED" || app.status === "SCHEDULED";
        }
        if (activeTab === "COMPLETED") return app.status === "COMPLETED";
        if (activeTab === "CANCELLED") return app.status === "CANCELLED";
        return true;
      })
      .filter((app) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          (app.doctorName && app.doctorName.toLowerCase().includes(q)) ||
          (app.hospitalName && app.hospitalName.toLowerCase().includes(q)) ||
          (app.reason && app.reason.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "DOCTOR_AZ") {
          return (a.doctorName || "").localeCompare(b.doctorName || "");
        }
        if (sortBy === "STATUS") {
          return (a.status || "").localeCompare(b.status || "");
        }
        const dateA = parseDateTime(a.appointmentDate, a.appointmentTime);
        const dateB = parseDateTime(b.appointmentDate, b.appointmentTime);
        if (sortBy === "NEWEST") return dateB - dateA;
        if (sortBy === "OLDEST") return dateA - dateB;
        return 0;
      });
  }, [appointments, activeTab, searchQuery, sortBy]);

  return (
    <div className="container py-4 my-appointments-page fade-in">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-1.5 rounded-pill fw-semibold mb-2 d-inline-flex align-items-center gap-2">
            <FaCalendarCheck /> Clinical Consultation Tracker
          </span>
          <h1 className="fw-bold text-white display-6 mb-1 font-heading">
            My Appointments
          </h1>
          <p className="text-muted small mb-0">
            Track scheduled visits, specialist consultations, and appointment status.
          </p>
        </div>

        <button
          className="btn btn-secondary-glow btn-sm d-flex align-items-center gap-2"
          onClick={fetchAppointments}
          disabled={loading}
        >
          <FaClockRotateLeft className={loading ? "spin" : ""} /> <span>Refresh</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <GlassCard className="p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small d-block">Total Bookings</span>
                <h3 className="mb-0 fw-bold text-white">{stats.total}</h3>
              </div>
              <FaCalendarCheck className="text-primary fs-3" />
            </div>
          </GlassCard>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <GlassCard className="p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small d-block">Upcoming</span>
                <h3 className="mb-0 fw-bold text-warning">{stats.upcoming}</h3>
              </div>
              <FaClock className="text-warning fs-3" />
            </div>
          </GlassCard>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <GlassCard className="p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small d-block">Completed</span>
                <h3 className="mb-0 fw-bold text-success">{stats.completed}</h3>
              </div>
              <FaCalendarCheck className="text-success fs-3" />
            </div>
          </GlassCard>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <GlassCard className="p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small d-block">Cancelled</span>
                <h3 className="mb-0 fw-bold text-danger">{stats.cancelled}</h3>
              </div>
              <FaBan className="text-danger fs-3" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-5">
            <div className="d-flex gap-1 overflow-x-auto pb-1">
              {["ALL", "UPCOMING", "COMPLETED", "CANCELLED"].map((tab) => (
                <button
                  key={tab}
                  className={`btn ${activeTab === tab ? "btn-primary-glow" : "btn-secondary-glow"} btn-sm rounded-pill px-3`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                <FaMagnifyingGlass />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by doctor or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="DOCTOR_AZ">Doctor: A to Z</option>
              <option value="STATUS">Sort by Status</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between mb-4 shadow-sm" role="alert">
          <div>
            <strong>Error: </strong> {error}
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchAppointments}>
            Retry
          </button>
        </div>
      )}

      {/* Appointments Grid */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-cyan" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading your appointment records...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={<FaCalendarCheck />}
          title="No Appointments Found"
          description={
            searchQuery
              ? `No appointments matching "${searchQuery}"`
              : activeTab !== "ALL"
              ? `You currently have no ${activeTab.toLowerCase()} appointments.`
              : "You haven't scheduled any medical appointments yet."
          }
          actionText="Find & Book Doctors"
          onAction={() => navigate("/hospitals")}
        />
      ) : (
        <div className="row g-4">
          {filteredAppointments.map((app) => {
            const isUpcoming =
              app.status === "UPCOMING" ||
              app.status === "BOOKED" ||
              app.status === "SCHEDULED";

            return (
              <div className="col-12 col-md-6 col-xl-4" key={app.id}>
                <GlassCard className="p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-dark border border-secondary border-opacity-25 text-muted small">
                        #{app.id}
                      </span>
                      <StatusBadge status={app.status || "BOOKED"} />
                    </div>

                    {/* Doctor Info */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "44px",
                          height: "44px",
                          background: "rgba(59, 130, 246, 0.2)",
                          color: "#38bdf8",
                          fontSize: "1.2rem",
                        }}
                      >
                        {app.doctorName ? app.doctorName.charAt(0) : "D"}
                      </div>
                      <div>
                        <h5 className="fw-bold text-white mb-0">
                          {app.doctorName || "Doctor N/A"}
                        </h5>
                        <small className="text-cyan">
                          {app.specialization || "Specialist Physician"}
                        </small>
                      </div>
                    </div>

                    {/* Date & Time Box */}
                    <div className="p-2.5 rounded bg-dark border border-secondary border-opacity-25 mb-3">
                      <div className="row g-2">
                        <div className="col-6 d-flex align-items-center gap-2 text-muted small">
                          <FaCalendarCheck className="text-primary" />
                          <div>
                            <span className="d-block" style={{ fontSize: "0.7rem" }}>Date</span>
                            <strong className="text-white">{formatDate(app.appointmentDate)}</strong>
                          </div>
                        </div>

                        <div className="col-6 d-flex align-items-center gap-2 text-muted small">
                          <FaClock className="text-cyan" />
                          <div>
                            <span className="d-block" style={{ fontSize: "0.7rem" }}>Time</span>
                            <strong className="text-white">{formatTime(app.appointmentTime)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    {app.reason && (
                      <div className="p-2.5 rounded bg-dark border border-secondary border-opacity-25 mb-3">
                        <small className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
                          Reason for Visit:
                        </small>
                        <span className="small text-secondary">{app.reason}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-top border-secondary border-opacity-25">
                    {isUpcoming ? (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1.5"
                        onClick={() => setSelectedAppointment(app)}
                      >
                        <FaBan /> <span>Cancel Appointment</span>
                      </button>
                    ) : (
                      <button className="btn btn-secondary-glow btn-sm w-100 text-muted" disabled>
                        Visit Closed
                      </button>
                    )}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Confirm Appointment Cancellation"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary-glow btn-sm"
              onClick={() => setSelectedAppointment(null)}
              disabled={cancelling}
            >
              Keep
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleConfirmCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </>
        }
      >
        <p className="text-secondary mb-0">
          Are you sure you want to cancel your consultation with{" "}
          <strong>{selectedAppointment?.doctorName}</strong> on{" "}
          <strong>{formatDate(selectedAppointment?.appointmentDate)}</strong> at{" "}
          <strong>{formatTime(selectedAppointment?.appointmentTime)}</strong>?
        </p>
      </Modal>
    </div>
  );
}

export default MyAppointments;