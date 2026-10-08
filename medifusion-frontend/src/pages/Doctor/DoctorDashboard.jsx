import React, { useState, useEffect } from "react";
import appointmentService from "../../services/appointmentService";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import EmptyState from "../../components/EmptyState/EmptyState";
import {
  FaUserDoctor,
  FaCalendarCheck,
  FaClock,
  FaCheck,
  FaXmark,
  FaCircleCheck,
} from "react-icons/fa6";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getAllAppointments();
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
      setAppointments(list);
    } catch (err) {
      console.error("Failed to load doctor appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      if (newStatus === "CANCELLED") {
        await appointmentService.cancelAppointment(id);
      }
      fetchAppointments();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === "BOOKED" || a.status === "PENDING" || a.status === "SCHEDULED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const cancelledCount = appointments.filter((a) => a.status === "CANCELLED").length;

  return (
    <div className="container py-4 fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-1.5 rounded-pill fw-semibold mb-2 d-inline-flex align-items-center gap-2">
            <FaUserDoctor /> Doctor Portal
          </span>
          <h2 className="fw-bold text-white mb-1 font-heading">Doctor Clinical Dashboard</h2>
          <p className="text-muted small mb-0">Review patient visit requests and manage appointment schedules.</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <GlassCard className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Pending / Active Bookings</span>
              <FaClock className="text-warning fs-4" />
            </div>
            <h3 className="fw-bold text-white mb-0">{pendingCount}</h3>
          </GlassCard>
        </div>
        <div className="col-md-4">
          <GlassCard className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Completed Visits</span>
              <FaCircleCheck className="text-success fs-4" />
            </div>
            <h3 className="fw-bold text-white mb-0">{completedCount}</h3>
          </GlassCard>
        </div>
        <div className="col-md-4">
          <GlassCard className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Cancelled Visits</span>
              <FaXmark className="text-danger fs-4" />
            </div>
            <h3 className="fw-bold text-white mb-0">{cancelledCount}</h3>
          </GlassCard>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-cyan" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading patient visit schedule...</p>
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState icon={<FaCalendarCheck />} title="No Patient Appointments" description="Your clinical appointment schedule is currently clear." />
      ) : (
        <div className="table-responsive glass-card p-0 overflow-hidden">
          <table className="table table-dark-custom mb-0 align-middle">
            <thead>
              <tr style={{ background: "rgba(18, 25, 41, 0.95)" }}>
                <th>Patient Name</th>
                <th>Doctor / Department</th>
                <th>Date & Time</th>
                <th>Reason for Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td className="fw-bold text-white">{apt.user?.fullName || `Patient #${apt.id}`}</td>
                  <td>{apt.doctor?.fullName || "Assigned Practitioner"}</td>
                  <td>
                    <small className="text-cyan fw-medium">
                      {apt.appointmentDate} at {apt.appointmentTime}
                    </small>
                  </td>
                  <td>
                    <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: "180px" }}>
                      {apt.reason || "General Consultation"}
                    </small>
                  </td>
                  <td>
                    <StatusBadge status={apt.status || "BOOKED"} />
                  </td>
                  <td>
                    {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                      <button
                        className="btn btn-sm btn-outline-danger px-3 py-1 rounded-pill"
                        onClick={() => handleStatusUpdate(apt.id, "CANCELLED")}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
