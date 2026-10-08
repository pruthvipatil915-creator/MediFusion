import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../../services/api";

function RoleGuard({ requiredRole = "ADMIN" }) {
  const token = localStorage.getItem("token");
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(!role);

  useEffect(() => {
    const checkRole = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (!role) {
        try {
          const response = await api.get("/user/profile");
          const userRole = response.data?.role || "USER";
          setRole(userRole);
          localStorage.setItem("role", userRole);
        } catch (error) {
          console.error("Role check error:", error);
          setRole("USER");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkRole();
  }, [token, role]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-cyan" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted small">Verifying authorization...</p>
      </div>
    );
  }

  const userRoleUpper = (role || "").toUpperCase();
  const reqRoleUpper = requiredRole.toUpperCase();

  if (userRoleUpper !== reqRoleUpper && userRoleUpper !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleGuard;
