import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaHeartPulse, FaShieldHalved, FaRobot } from "react-icons/fa6";
import {
  FiLogOut,
  FiUser,
  FiHome,
  FiActivity,
  FiSearch,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import api from "../../services/api";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [role, setRole] = useState(localStorage.getItem("role") || "USER");

  useEffect(() => {
    if (token && !localStorage.getItem("role")) {
      api
        .get("/user/profile")
        .then((res) => {
          if (res.data?.role) {
            setRole(res.data.role);
            localStorage.setItem("role", res.data.role);
          }
        })
        .catch((err) => {
          console.error("Navbar profile role error:", err);
        });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isAdmin = (role || "").toUpperCase() === "ADMIN";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="brand-logo" to="/">
          <div className="brand-icon-wrapper">
            <FaHeartPulse />
          </div>
          <span>MediFusion</span>
          <span className="brand-ai-badge">AI Health</span>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-1 mt-3 mt-lg-0">
            <NavLink className="nav-link d-flex align-items-center gap-1.5" to="/">
              <FiHome /> <span>Home</span>
            </NavLink>

            {!token ? (
              <>
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>

                <NavLink
                  className="btn btn-primary-glow btn-sm ms-lg-2 text-white"
                  to="/register"
                >
                  Get Started
                </NavLink>
              </>
            ) : (
              <>
                <NavLink className="nav-link d-flex align-items-center gap-1.5" to="/dashboard">
                  <FiActivity /> <span>Dashboard</span>
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center gap-1.5" to="/prediction">
                  <FaHeartPulse /> <span>Prediction</span>
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center gap-1.5" to="/hospitals">
                  <FiSearch /> <span>Doctors</span>
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center gap-1.5" to="/history">
                  <FiClock /> <span>History</span>
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center gap-1.5" to="/my-appointments">
                  <FiCalendar /> <span>Appointments</span>
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center gap-1.5" to="/chatbot">
                  <FaRobot /> <span>AI Assistant</span>
                </NavLink>

                <NavLink className="nav-link d-flex align-items-center gap-1.5" to="/profile">
                  <FiUser /> <span>Profile</span>
                </NavLink>

                {isAdmin && (
                  <NavLink
                    className="nav-link d-flex align-items-center gap-1.5 badge-admin-nav"
                    to="/admin"
                  >
                    <FaShieldHalved /> <span>Admin</span>
                  </NavLink>
                )}

                <button
                  className="nav-logout-btn d-flex align-items-center gap-1.5 ms-lg-3 mt-2 mt-lg-0"
                  onClick={handleLogout}
                >
                  <FiLogOut /> <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;