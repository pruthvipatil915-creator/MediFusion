import React, { useState, useEffect, useMemo } from "react";
import {
  getAdminHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} from "../../services/adminService";
import GlassCard from "../../components/GlassCard/GlassCard";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import EmptyState from "../../components/EmptyState/EmptyState";
import {
  FaHospital,
  FaPlus,
  FaPenToSquare,
  FaTrashCan,
  FaMagnifyingGlass,
  FaBuilding,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";

function AdminHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    hospitalName: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    specialization: "Multispeciality",
  });

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await getAdminHospitals();
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load hospitals:", err);
      setToast({ message: "Failed to load hospitals list", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedHospital(null);
    setFormData({
      hospitalName: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      specialization: "Multispeciality",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      hospitalName: hospital.hospitalName || "",
      city: hospital.city || "",
      address: hospital.address || "",
      phone: hospital.phone || "",
      email: hospital.email || "",
      specialization: hospital.specialization || "Multispeciality",
    });
    setIsModalOpen(true);
  };

  const handleSaveHospital = async (e) => {
    e.preventDefault();
    if (!formData.hospitalName.trim() || !formData.city.trim()) {
      setToast({ message: "Please fill in all required fields", type: "warning" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        hospitalName: formData.hospitalName.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        specialization: formData.specialization.trim(),
      };

      if (selectedHospital && selectedHospital.id) {
        await updateHospital(selectedHospital.id, payload);
        setToast({ message: "Hospital details updated successfully!", type: "success" });
      } else {
        await createHospital(payload);
        setToast({ message: "New hospital registered successfully!", type: "success" });
      }

      setIsModalOpen(false);
      fetchHospitals();
    } catch (err) {
      console.error("Save hospital error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to save hospital.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHospital = async () => {
    if (!selectedHospital) return;
    setSaving(true);
    try {
      await deleteHospital(selectedHospital.id);
      setToast({ message: "Hospital deleted successfully!", type: "success" });
      setIsDeleteModalOpen(false);
      fetchHospitals();
    } catch (err) {
      console.error("Delete hospital error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to delete hospital.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchSearch =
        !searchQuery.trim() ||
        (h.hospitalName && h.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (h.city && h.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (h.specialization && h.specialization.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchSearch;
    });
  }, [hospitals, searchQuery]);

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
            <FaHospital className="text-cyan" /> Hospital Management
          </h2>
          <p className="text-muted small mb-0">
            Maintain registered medical centers, clinics, and hospital infrastructure.
          </p>
        </div>

        <button
          className="btn btn-primary-glow d-flex align-items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <FaPlus /> <span>Register Hospital</span>
        </button>
      </div>

      {/* Filter Bar */}
      <GlassCard className="p-3 mb-4">
        <div className="input-group input-group-sm">
          <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
            <FaMagnifyingGlass />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by hospital name, city, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* Table */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-cyan" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading hospital records...</p>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <EmptyState
          icon={<FaHospital />}
          title="No Hospitals Registered"
          description="No hospital records match your search criteria."
          actionText="Register Hospital"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-responsive glass-card p-0 overflow-hidden">
          <table className="table table-dark-custom mb-0 align-middle">
            <thead>
              <tr style={{ background: "rgba(18, 25, 41, 0.95)" }}>
                <th>Hospital</th>
                <th>Specialization</th>
                <th>City & Address</th>
                <th>Contact</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((h) => (
                <tr key={h.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "36px",
                          height: "36px",
                          background: "rgba(6, 182, 212, 0.2)",
                          color: "#22d3ee",
                        }}
                      >
                        <FaBuilding />
                      </div>
                      <div>
                        <div className="fw-bold text-white">{h.hospitalName}</div>
                        <small className="text-muted">ID: #{h.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-2.5 py-1 rounded-pill">
                      {h.specialization || "Multispeciality"}
                    </span>
                  </td>
                  <td>
                    <div className="text-secondary small">{h.city}</div>
                    <small className="text-muted">{h.address || "Address not provided"}</small>
                  </td>
                  <td>
                    {h.phone && (
                      <div className="text-muted small d-flex align-items-center gap-1">
                        <FaPhone style={{ fontSize: "0.75rem" }} /> <span>{h.phone}</span>
                      </div>
                    )}
                    {h.email && (
                      <div className="text-muted small d-flex align-items-center gap-1">
                        <FaEnvelope style={{ fontSize: "0.75rem" }} /> <span>{h.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary-glow p-1.5"
                        onClick={() => handleOpenEditModal(h)}
                        title="Edit Hospital"
                      >
                        <FaPenToSquare />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger p-1.5"
                        onClick={() => {
                          setSelectedHospital(h);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete Hospital"
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedHospital ? "Edit Hospital Details" : "Register New Hospital"}
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
              onClick={handleSaveHospital}
              disabled={saving}
            >
              {saving ? "Saving..." : selectedHospital ? "Update Hospital" : "Register"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveHospital}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Hospital Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Apollo, Fortis, AIIMS, etc."
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Specialization Focus
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Multispeciality, Cardiology, Trauma"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai, Pune, Delhi"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Contact Phone
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Official desk number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="contact@hospital.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">
                Full Physical Address
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Street address, Landmark, Pin code"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Hospital Deletion"
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
              onClick={handleDeleteHospital}
              disabled={saving}
            >
              {saving ? "Deleting..." : "Delete Hospital"}
            </button>
          </>
        }
      >
        <p className="text-secondary mb-0">
          Are you sure you want to delete <strong>{selectedHospital?.hospitalName}</strong>? All associated links will be impacted.
        </p>
      </Modal>
    </div>
  );
}

export default AdminHospitals;
