import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import {
  FaUser,
  FaKey,
  FaShieldHalved,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaCalendarDays,
  FaVenusMars,
  FaTriangleExclamation,
  FaFloppyDisk,
} from "react-icons/fa6";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  // State
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Edit Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [updating, setUpdating] = useState(false);

  // Change Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/profile");
      const data = response.data;
      setProfile(data);
      setFullName(data.fullName || "");
      setPhone(data.phone || "");
      setGender(data.gender || "Male");
      setAge(data.age || "");
      setAddress(data.address || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
      setToast({
        message: err?.response?.data?.message || "Unable to load user profile.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone ? phone.trim() : null,
        gender,
        age: age ? Number(age) : null,
        address: address ? address.trim() : null,
      };

      const response = await api.put("/user/profile", payload);
      setProfile(response.data);
      if (response.data?.fullName) {
        localStorage.setItem("fullName", response.data.fullName);
      }
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      console.error("Update profile error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: "New passwords do not match!", type: "warning" });
      return;
    }

    setPasswordUpdating(true);

    try {
      const response = await api.put("/user/change-password", {
        oldPassword,
        newPassword,
      });

      const message =
        typeof response.data === "string"
          ? response.data
          : "Password changed successfully!";
      setToast({ message, type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to change password.",
        type: "error",
      });
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/user/delete");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Delete account error:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to delete account.",
        type: "error",
      });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-cyan" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Loading your profile...</h5>
      </div>
    );
  }

  return (
    <div className="container profile-container my-5 fade-in">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Banner Card */}
      <GlassCard className="p-4 mb-4">
        <div className="d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start">
          <div className="profile-avatar-wrapper">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="flex-grow-1">
            <h2 className="fw-bold text-white mb-1 font-heading">
              {profile?.fullName || "User Profile"}
            </h2>
            <p className="text-muted small mb-2 d-flex align-items-center justify-content-center justify-content-sm-start gap-1.5">
              <FaEnvelope className="text-cyan" /> {profile?.email}
            </p>
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2">
              <StatusBadge
                status={profile?.role || "USER"}
                type={profile?.role === "ADMIN" ? "info" : "default"}
              />
              <span className="badge bg-dark border border-secondary border-opacity-25 text-muted px-2.5 py-1 rounded-pill small">
                User ID: #{profile?.id}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Navigation Pills */}
      <div className="d-flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          className={`btn ${activeTab === "profile" ? "btn-primary-glow" : "btn-secondary-glow"} btn-sm rounded-pill px-4 d-flex align-items-center gap-2`}
          onClick={() => setActiveTab("profile")}
        >
          <FaUser /> <span>Personal Details</span>
        </button>

        <button
          className={`btn ${activeTab === "password" ? "btn-primary-glow" : "btn-secondary-glow"} btn-sm rounded-pill px-4 d-flex align-items-center gap-2`}
          onClick={() => setActiveTab("password")}
        >
          <FaKey /> <span>Security</span>
        </button>

        <button
          className={`btn ${activeTab === "danger" ? "btn-outline-danger active" : "btn-secondary-glow"} btn-sm rounded-pill px-4 d-flex align-items-center gap-2 text-danger`}
          onClick={() => setActiveTab("danger")}
        >
          <FaTriangleExclamation /> <span>Danger Zone</span>
        </button>
      </div>

      {/* Tab 1: Edit Profile */}
      {activeTab === "profile" && (
        <GlassCard className="p-4">
          <h4 className="fw-bold text-white mb-4 font-heading d-flex align-items-center gap-2">
            <FaUser className="text-cyan" /> Personal Details
          </h4>

          <form onSubmit={handleUpdateProfile}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    value={profile?.email || ""}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">
                  Phone Number
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaPhone />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label small text-secondary fw-semibold">
                  Gender
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaVenusMars />
                  </span>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label small text-secondary fw-semibold">
                  Age
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaCalendarDays />
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="120"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12">
                <label className="form-label small text-secondary fw-semibold">
                  Residential Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaLocationDot />
                  </span>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter your street address, city, pin code..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-4 text-end">
              <button
                type="submit"
                className="btn btn-primary-glow px-4 py-2 d-inline-flex align-items-center gap-2"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaFloppyDisk /> <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tab 2: Security */}
      {activeTab === "password" && (
        <GlassCard className="p-4">
          <h4 className="fw-bold text-white mb-4 font-heading d-flex align-items-center gap-2">
            <FaKey className="text-cyan" /> Change Password
          </h4>

          <form onSubmit={handleChangePassword}>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label small text-secondary fw-semibold">
                  Current Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">
                  New Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">
                  Confirm New Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary-glow px-4 py-2"
                disabled={passwordUpdating}
              >
                {passwordUpdating ? "Updating Password..." : "Change Password"}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tab 3: Danger Zone */}
      {activeTab === "danger" && (
        <GlassCard className="p-4 border-danger border-opacity-50">
          <h4 className="fw-bold text-danger mb-3 font-heading d-flex align-items-center gap-2">
            <FaTriangleExclamation /> Delete Account
          </h4>
          <p className="text-muted small mb-4">
            Once you delete your account, your personal details, saved prediction records, and scheduled appointments will be permanently removed. This action is irreversible.
          </p>

          <button
            type="button"
            className="btn btn-outline-danger px-4 py-2 fw-semibold"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete My Account
          </button>
        </GlassCard>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Permanent Deletion"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary-glow btn-sm"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, Delete Account"}
            </button>
          </>
        }
      >
        <p className="text-secondary mb-0">
          Are you sure you want to permanently delete your MediFusion account? All your personal health records will be erased.
        </p>
      </Modal>
    </div>
  );
}

export default Profile;
