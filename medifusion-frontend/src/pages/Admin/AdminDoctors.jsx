import React, { useState, useEffect, useMemo } from "react";
import {
  getAdminDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../services/adminService";
import GlassCard from "../../components/GlassCard/GlassCard";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import EmptyState from "../../components/EmptyState/EmptyState";
import {
  FaUserDoctor,
  FaPlus,
  FaPenToSquare,
  FaTrashCan,
  FaMagnifyingGlass,
  FaStethoscope,
} from "react-icons/fa6";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Oncology",
  "Dermatology",
  "General Medicine",
  "ENT",
  "Gastroenterology",
  "Pulmonology",
];

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [specFilter, setSpecFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "General Medicine",
    hospitalName: "",
    city: "",
    experience: "",
    availableDays: "Mon - Fri",
    availableTime: "09:00 AM - 05:00 PM",
    consultationFee: "",
    phone: "",
  });

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await getAdminDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setToast({ message: "Failed to load doctors list", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedDoctor(null);
    setFormData({
      fullName: "",
      specialization: "General Medicine",
      hospitalName: "",
      city: "",
      experience: "",
      availableDays: "Mon - Fri",
      availableTime: "09:00 AM - 05:00 PM",
      consultationFee: "",
      phone: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      fullName: doctor.fullName || "",
      specialization: doctor.specialization || "General Medicine",
      hospitalName: doctor.hospitalName || "",
      city: doctor.city || "",
      experience: doctor.experience !== undefined ? String(doctor.experience) : "",
      availableDays: doctor.availableDays || "Mon - Fri",
      availableTime: doctor.availableTime || "09:00 AM - 05:00 PM",
      consultationFee: doctor.consultationFee !== undefined ? String(doctor.consultationFee) : "",
      phone: doctor.phone || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.hospitalName.trim() || !formData.city.trim()) {
      setToast({ message: "Please fill in all required fields", type: "warning" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        specialization: formData.specialization,
        hospitalName: formData.hospitalName.trim(),
        city: formData.city.trim(),
        experience: formData.experience ? parseInt(formData.experience, 10) : null,
        availableDays: formData.availableDays.trim(),
        availableTime: formData.availableTime.trim(),
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : null,
        phone: formData.phone.trim(),
      };

      if (selectedDoctor && selectedDoctor.id) {
        await updateDoctor(selectedDoctor.id, payload);
        setToast({ message: "Doctor profile updated successfully!", type: "success" });
      } else {
        await createDoctor(payload);
        setToast({ message: "New doctor added successfully!", type: "success" });
      }

      setIsModalOpen(false);
      fetchDoctors();
    } catch (err) {
      console.error("Save doctor error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to save doctor details.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;
    setSaving(true);
    try {
      await deleteDoctor(selectedDoctor.id);
      setToast({ message: "Doctor deleted successfully!", type: "success" });
      setIsDeleteModalOpen(false);
      fetchDoctors();
    } catch (err) {
      console.error("Delete doctor error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to delete doctor.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSearch =
        !searchQuery.trim() ||
        (doc.fullName && doc.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.hospitalName && doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.city && doc.city.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSpec =
        specFilter === "ALL" ||
        (doc.specialization && doc.specialization.toLowerCase() === specFilter.toLowerCase());

      return matchSearch && matchSpec;
    });
  }, [doctors, searchQuery, specFilter]);

  return (
    <div className="fade-in">
      {/* Toast Notification */}
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
            <FaUserDoctor className="text-primary" /> Doctor Management
          </h2>
          <p className="text-muted small mb-0">
            View, add, modify, or remove medical doctor profiles and hospital affiliations.
          </p>
        </div>

        <button
          className="btn btn-primary-glow d-flex align-items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <FaPlus /> <span>Add Doctor</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
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
                placeholder="Search by name, hospital, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end gap-2">
            <span className="small text-muted fw-semibold">Specialization:</span>
            <select
              className="form-select form-select-sm w-auto"
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
            >
              <option value="ALL">All Specializations</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Doctors Table */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-cyan" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading doctor records...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <EmptyState
          icon={<FaUserDoctor />}
          title="No Doctors Found"
          description="No doctor records match your search query."
          actionText="Add New Doctor"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-responsive glass-card p-0 overflow-hidden">
          <table className="table table-dark-custom mb-0 align-middle">
            <thead>
              <tr style={{ background: "rgba(18, 25, 41, 0.95)" }}>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Hospital</th>
                <th>City</th>
                <th>Experience</th>
                <th>Fee</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "36px",
                          height: "36px",
                          background: "rgba(59, 130, 246, 0.2)",
                          color: "#38bdf8",
                        }}
                      >
                        {doc.fullName ? doc.fullName.charAt(0) : "D"}
                      </div>
                      <div>
                        <div className="fw-bold text-white">{doc.fullName}</div>
                        {doc.phone && <small className="text-muted">{doc.phone}</small>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-2.5 py-1 rounded-pill">
                      {doc.specialization}
                    </span>
                  </td>
                  <td className="text-secondary">{doc.hospitalName}</td>
                  <td className="text-muted">{doc.city}</td>
                  <td className="text-muted">{doc.experience ? `${doc.experience} yrs` : "N/A"}</td>
                  <td className="text-success font-medium">
                    {doc.consultationFee ? `₹${doc.consultationFee}` : "Free / N/A"}
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary-glow p-1.5"
                        onClick={() => handleOpenEditModal(doc)}
                        title="Edit Doctor"
                      >
                        <FaPenToSquare />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger p-1.5"
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete Doctor"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDoctor ? "Edit Doctor Profile" : "Add New Doctor"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary-glow btn-sm"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary-glow btn-sm"
              onClick={handleSaveDoctor}
              disabled={saving}
            >
              {saving ? "Saving..." : selectedDoctor ? "Update Doctor" : "Add Doctor"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveDoctor}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Dr. Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Specialization <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              >
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Hospital Affiliation <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai, Pune"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small text-secondary fw-semibold">
                Experience (Years)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 10"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small text-secondary fw-semibold">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 500"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small text-secondary fw-semibold">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="10-digit number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Available Days
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Mon - Fri"
                value={formData.availableDays}
                onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Available Time
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="09:00 AM - 05:00 PM"
                value={formData.availableTime}
                onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Doctor Deletion"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary-glow btn-sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleDeleteDoctor}
              disabled={saving}
            >
              {saving ? "Deleting..." : "Delete Doctor"}
            </button>
          </>
        }
      >
        <p className="text-secondary mb-0">
          Are you sure you want to delete doctor <strong>{selectedDoctor?.fullName}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default AdminDoctors;
