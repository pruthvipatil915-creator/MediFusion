import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaGaugeHigh,
  FaUserGroup,
  FaUserDoctor,
  FaHospital,
  FaCalendarCheck,
  FaChartLine,
  FaArrowLeft,
  FaShieldHalved,
} from "react-icons/fa6";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="admin-layout-wrapper">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="d-flex align-items-center gap-2">
            <div className="admin-badge-icon">
              <FaShieldHalved />
            </div>
            <div>
              <h6 className="fw-bold text-white mb-0 font-heading">MediFusion</h6>
              <small className="text-cyan fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
                ADMIN PORTAL
              </small>
            </div>
          </div>
        </div>

        <nav className="admin-nav-links">
          <NavLink to="/admin" end className="admin-nav-item">
            <FaGaugeHigh /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/doctors" className="admin-nav-item">
            <FaUserDoctor /> <span>Doctors</span>
          </NavLink>
          <NavLink to="/admin/hospitals" className="admin-nav-item">
            <FaHospital /> <span>Hospitals</span>
          </NavLink>
          <NavLink to="/admin/appointments" className="admin-nav-item">
            <FaCalendarCheck /> <span>Appointments</span>
          </NavLink>
          <NavLink to="/admin/predictions" className="admin-nav-item">
            <FaChartLine /> <span>AI Analytics</span>
          </NavLink>
          <NavLink to="/admin/users" className="admin-nav-item">
            <FaUserGroup /> <span>Users</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="btn btn-secondary-glow btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft /> <span>User Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="admin-main-content">
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
