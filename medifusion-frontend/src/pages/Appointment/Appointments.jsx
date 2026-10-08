import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import appointmentService from "../../services/appointmentService";
import api from "../../services/api";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import {
  FaCalendarCheck,
  FaUserDoctor,
  FaHospital,
  FaClock,
  FaCircleCheck,
  FaTriangleExclamation,
  FaStethoscope,
  FaFileLines,
} from "react-icons/fa6";
import "./Appointments.css";

const TIME_SLOTS = {
  Morning: [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ],
  Afternoon: [
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ],
};

const MAX_REASON_LENGTH = 500;

export default function Appointments() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const doctor = stateData.doctor || stateData.hospital || stateData;
  const hospitalName = doctor.hospitalName || doctor.name || "Medical Care Center";
  const doctorId = doctor.doctorId || doctor.id || 1;
  const doctorName = doctor.doctorName || doctor.fullName || doctor.name || "Specialist Physician";
  const specialization = doctor.specialization || "General Medicine";

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const todayRaw = new Date();
  const todayISO = todayRaw.toISOString().split("T")[0];

  const formattedToday = todayRaw.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatAppointmentDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isFormValid =
    appointmentDate.trim() !== "" &&
    appointmentTime.trim() !== "" &&
    reason.trim() !== "";

  const handleReasonChange = (e) => {
    if (e.target.value.length <= MAX_REASON_LENGTH) {
      setReason(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setErrorMsg("");
    setLoading(true);

    try {
      let activeUserId = localStorage.getItem("userId");

      // Safe user ID fallback resolution
      if (!activeUserId || activeUserId === "null" || activeUserId === "undefined") {
        try {
          const profileRes = await api.get("/user/profile");
          if (profileRes.data?.id) {
            activeUserId = String(profileRes.data.id);
            localStorage.setItem("userId", activeUserId);
          }
        } catch (pErr) {
          console.error("Profile resolution error:", pErr);
        }
      }

      if (!activeUserId || activeUserId === "null" || activeUserId === "undefined") {
        setErrorMsg("Your session is invalid. Please log in again.");
        setLoading(false);
        return;
      }

      const payload = {
        doctorId: Number(doctorId),
        appointmentDate,
        appointmentTime: appointmentTime.includes(":") ? appointmentTime : "09:00:00",
        reason: reason.trim(),
      };

      await appointmentService.bookAppointment(activeUserId, payload);
      setBookingSuccess(true);

      setTimeout(() => {
        navigate("/my-appointments");
      }, 2000);
    } catch (err) {
      console.error("Booking error:", err);
      const serverMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to schedule appointment. Please try again.";
      setErrorMsg(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 appointment-page-wrapper fade-in">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-1.5 rounded-pill fw-semibold mb-2 d-inline-flex align-items-center gap-2">
            <FaCalendarCheck /> Clinical Consultation
          </span>
          <h1 className="fw-bold text-white display-6 mb-1 font-heading">
            Book Specialist Appointment
          </h1>
          <p className="text-muted small mb-0">
            Confirm your consultation slot with accredited medical specialists.
          </p>
        </div>

        <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-2 rounded-pill font-semibold">
          MediFusion Health
        </span>
      </div>

      <div className="row g-4">
        {/* Left Column: Doctor & Facility Overview */}
        <div className="col-lg-5">
          <GlassCard className="p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-white mb-4 font-heading d-flex align-items-center gap-2">
                <FaUserDoctor className="text-cyan" /> Selected Medical Provider
              </h5>

              {/* Doctor */}
              <div className="d-flex align-items-start gap-3 mb-3 p-3 rounded bg-dark border border-secondary border-opacity-25">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(59, 130, 246, 0.2)",
                    fontSize: "1.2rem",
                  }}
                >
                  <FaUserDoctor />
                </div>
                <div>
                  <span className="text-uppercase text-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    Physician
                  </span>
                  <h5 className="mb-0 fw-bold text-white">{doctorName}</h5>
                </div>
              </div>

              {/* Specialization */}
              <div className="d-flex align-items-start gap-3 mb-3 p-3 rounded bg-dark border border-secondary border-opacity-25">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-cyan fw-bold flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(6, 182, 212, 0.2)",
                    fontSize: "1.2rem",
                  }}
                >
                  <FaStethoscope />
                </div>
                <div>
                  <span className="text-uppercase text-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    Specialization
                  </span>
                  <h6 className="mb-0 fw-bold text-cyan">{specialization}</h6>
                </div>
              </div>

              {/* Hospital */}
              <div className="d-flex align-items-start gap-3 mb-3 p-3 rounded bg-dark border border-secondary border-opacity-25">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-warning fw-bold flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(245, 158, 11, 0.2)",
                    fontSize: "1.2rem",
                  }}
                >
                  <FaHospital />
                </div>
                <div>
                  <span className="text-uppercase text-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    Hospital Facility
                  </span>
                  <h6 className="mb-0 fw-bold text-white">{hospitalName}</h6>
                </div>
              </div>
            </div>

            {/* Booking Date Footer */}
            <div className="p-3 rounded bg-dark border border-secondary border-opacity-25 d-flex align-items-center justify-content-between mt-4">
              <small className="text-muted fw-medium d-flex align-items-center gap-1.5">
                <FaCalendarCheck className="text-primary" /> Today's Date
              </small>
              <small className="fw-bold text-cyan">{formattedToday}</small>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Booking Form or Confirmation Banner */}
        <div className="col-lg-7">
          <GlassCard className="p-4">
            {bookingSuccess ? (
              <div className="text-center py-4 confirmation-card">
                <div className="success-icon-wrapper rounded-circle mx-auto mb-3">
                  <FaCircleCheck className="text-success display-4" />
                </div>
                <h3 className="fw-bold text-success mb-2 font-heading">
                  Appointment Confirmed!
                </h3>
                <p className="text-muted small mb-4">
                  Your appointment has been registered with the hospital.
                </p>

                <div className="p-3 rounded bg-dark border border-secondary border-opacity-25 text-start mx-auto mb-4" style={{ maxWidth: "420px" }}>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary border-opacity-25 small">
                    <span className="text-muted">Doctor:</span>
                    <strong className="text-white">{doctorName}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary border-opacity-25 small">
                    <span className="text-muted">Hospital:</span>
                    <strong className="text-white">{hospitalName}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary border-opacity-25 small">
                    <span className="text-muted">Date:</span>
                    <strong className="text-cyan">{formatAppointmentDate(appointmentDate)}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 small">
                    <span className="text-muted">Time Slot:</span>
                    <strong className="text-cyan">{appointmentTime}</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center text-cyan fw-medium small">
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Redirecting to My Appointments...
                </div>
              </div>
            ) : (
              <>
                <h4 className="fw-bold text-white mb-4 font-heading">
                  Schedule Details
                </h4>

                {errorMsg && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <FaTriangleExclamation className="flex-shrink-0" />
                    <span className="small">{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Date Input */}
                  <div className="mb-3">
                    <label htmlFor="appointmentDate" className="form-label small text-secondary fw-semibold">
                      Appointment Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="appointmentDate"
                      className="form-control"
                      value={appointmentDate}
                      min={todayISO}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Time Slot Dropdown */}
                  <div className="mb-3">
                    <label htmlFor="appointmentTime" className="form-label small text-secondary fw-semibold">
                      Preferred Time Slot <span className="text-danger">*</span>
                    </label>
                    <select
                      id="appointmentTime"
                      className="form-select"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      required
                    >
                      <option value="">Select an available time slot</option>
                      {Object.entries(TIME_SLOTS).map(([category, slots]) => (
                        <optgroup key={category} label={category}>
                          {slots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Reason Textarea */}
                  <div className="mb-4">
                    <label htmlFor="reason" className="form-label small text-secondary fw-semibold">
                      Reason for Consultation / Symptoms <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="reason"
                      className="form-control"
                      rows="4"
                      maxLength={MAX_REASON_LENGTH}
                      placeholder="Briefly describe your symptoms or reason for consulting the doctor..."
                      value={reason}
                      onChange={handleReasonChange}
                      required
                    ></textarea>
                    <div className="d-flex justify-content-end mt-1">
                      <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                        {reason.length}/{MAX_REASON_LENGTH} characters
                      </small>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary-glow w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={!isFormValid || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Scheduling Appointment...</span>
                      </>
                    ) : (
                      <>
                        <FaCalendarCheck /> <span>Confirm & Schedule</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}