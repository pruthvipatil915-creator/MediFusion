import React, { useState, useEffect } from "react";
import { getAdminUsers } from "../../services/adminService";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import EmptyState from "../../components/EmptyState/EmptyState";
import {
  FaUserGroup,
  FaUser,
  FaMagnifyingGlass,
  FaEnvelope,
  FaPhone,
  FaShieldHalved,
} from "react-icons/fa6";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load user directory:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1 font-heading d-flex align-items-center gap-2">
            <FaUserGroup className="text-cyan" /> User & Role Management
          </h2>
          <p className="text-muted small mb-0">
            Audit user accounts, security roles, and profile authorization credentials.
          </p>
        </div>

        <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-2 rounded-pill">
          Role-Based Access Control
        </span>
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
            placeholder="Search by full name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* Users Table */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-cyan" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading user directory...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<FaUserGroup />}
          title="No Users Found"
          description="No user records currently match the search criteria."
        />
      ) : (
        <div className="table-responsive glass-card p-0 overflow-hidden">
          <table className="table table-dark-custom mb-0 align-middle">
            <thead>
              <tr style={{ background: "rgba(18, 25, 41, 0.95)" }}>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Demographics</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id || u.email}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "36px",
                          height: "36px",
                          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                          color: "#ffffff",
                        }}
                      >
                        {u.fullName ? u.fullName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="fw-bold text-white">{u.fullName}</div>
                        <small className="text-muted">ID: #{u.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-secondary small d-flex align-items-center gap-1.5">
                      <FaEnvelope className="text-muted" style={{ fontSize: "0.75rem" }} />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge
                      status={u.role || "USER"}
                      type={u.role === "ADMIN" ? "info" : "default"}
                    />
                  </td>
                  <td>
                    <div className="text-muted small">
                      {u.phone ? (
                        <span className="d-flex align-items-center gap-1">
                          <FaPhone style={{ fontSize: "0.75rem" }} /> {u.phone}
                        </span>
                      ) : (
                        "Not provided"
                      )}
                    </div>
                  </td>
                  <td>
                    <small className="text-secondary">
                      {u.gender || "Gender N/A"} • {u.age ? `${u.age} yrs` : "Age N/A"}
                    </small>
                  </td>
                  <td>
                    <small
                      className="text-muted text-truncate d-inline-block"
                      style={{ maxWidth: "160px" }}
                      title={u.address}
                    >
                      {u.address || "Address not provided"}
                    </small>
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

export default AdminUsers;
