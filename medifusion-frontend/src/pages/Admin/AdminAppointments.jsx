import React, { useState, useEffect, useMemo } from "react";
import {
  getAdminAppointments,
  cancelAdminAppointment,
  deleteAdminAppointment,
} from "../../services/adminService";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import EmptyState from "../../components/EmptyState/EmptyState";
import {
  FaCalendarCheck,
  FaMagnifyingGlass,
  FaFilter,
  FaBan,
  FaTrashCan,
  FaClock,
} from "react-icons/fa6";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAdminAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setToast({ message: "Failed to load appointments list", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      await cancelAdminAppointment(selectedAppointment.id);
      setToast({ message: "Appointment status updated to CANCELLED", type: "success" });
      setIsCancelModalOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error("Cancel appointment error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to cancel appointment.",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      await deleteAdminAppointment(selectedAppointment.id);
      setToast({ message: "Appointment record deleted successfully!", type: "success" });
      setIsDeleteModalOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error("Delete appointment error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to delete appointment.",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchSearch =
        !searchQuery.trim() ||
        (app.doctorName && app.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.userName && app.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.reason && app.reason.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === "ALL" ||
        (app.status && app.status.toUpperCase() === statusFilter);

      return matchSearch && matchStatus;
    });
  }, [appointments, searchQuery, statusFilter]);

  return (
    <div className="fade-in">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1 font-heading d-flex align-items-center gap-2">
            <FaCalendarCheck className="text-warning" /> Appointment Oversight
          </h2>
          <p className="text-muted small mb-0">
            Monitor patient booking requests, consultation schedules, and cancellations.
          </p>
        </div>

        <button
          className="btn btn-secondary-glow btn-sm"
          onClick={fetchAppointments}
        >
          <FaClock className="me-1" /> Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <GlassCard className="p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                <FaMagnifyingGlass />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by doctor, patient name, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end gap-2">
            <FaFilter className="text-muted small" />
            <span className="small text-muted fw-semibold">Status:</span>
            <select
              className="form-select form-select-sm w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="BOOKED">Booked / Upcoming</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-cyan" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading appointment records...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={<FaCalendarCheck />}
          title="No Appointments Found"
          description="No appointment records match your active search and filter criteria."
        />
      ) : (
        <div className="table-responsive glass-card p-0 overflow-hidden">
          <table className="table table-dark-custom mb-0 align-middle">
            <thead>
              <tr style={{ background: "rgba(18, 25, 41, 0.95)" }}>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Reason</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((app) => {
                const isUpcoming =
                  app.status === "BOOKED" ||
                  app.status === "SCHEDULED" ||
                  app.status === "UPCOMING";

                return (
                  <tr key={app.id}>
                    <td>
                      <span className="badge bg-light bg-opacity-10 text-muted">
                        #{app.id}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-white">
                        {app.userName || (app.userId ? `User #${app.userId}` : "N/A")}
                      </div>
                      {app.userId && <small className="text-muted">User ID: #{app.userId}</small>}
                    </td>
                    <td>
                      <div className="text-cyan fw-semibold">
                        {app.doctorName || (app.doctorId ? `Doctor #${app.doctorId}` : "N/A")}
                      </div>
                      {app.doctorId && <small className="text-muted">Doctor ID: #{app.doctorId}</small>}
                    </td>
                    <td>
                      <div className="text-white small">
                        {app.appointmentDate || "N/A"}
                      </div>
                      <small className="text-muted">{app.appointmentTime || "N/A"}</small>
                    </td>
                    <td>
                      <StatusBadge status={app.status || "BOOKED"} />
                    </td>
                    <td>
                      <div
                        className="text-secondary small text-truncate"
                        style={{ maxWidth: "200px" }}
                        title={app.reason}
                      >
                        {app.reason || "General Consultation"}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        {isUpcoming && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning p-1.5"
                            onClick={() => {
                              setSelectedAppointment(app);
                              setIsCancelModalOpen(true);
                            }}
                            title="Cancel Appointment"
                          >
                            <FaBan />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1.5"
                          onClick={() => {
                            setSelectedAppointment(app);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Delete Record"
                        >
                          <FaTrashCan />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Confirm Cancellation"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary-glow btn-sm"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={actionLoading}
            >
              Keep
            </button>
            <button
              type="button"
              className="btn btn-warning btn-sm"
              onClick={handleCancelAppointment}
              disabled={actionLoading}
            >
              {actionLoading ? "Cancelling..." : "Cancel Appointment"}
            </button>
          </>
        }
      >
        <p className="text-secondary mb-0">
          Cancel appointment <strong>#{selectedAppointment?.id}</strong> for patient{" "}
          <strong>{selectedAppointment?.userName || "User"}</strong>?
        </p>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Appointment Record"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary-glow btn-sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleDeleteAppointment}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete Permanently"}
            </button>
          </>
        }
      >
        <p className="text-secondary mb-0">
          Permanently delete appointment record <strong>#{selectedAppointment?.id}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default AdminAppointments;
