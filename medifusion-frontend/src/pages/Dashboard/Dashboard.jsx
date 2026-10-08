import "./Dashboard.css";
import { useEffect, useState } from "react";
import WelcomeCard from "../../components/Dashboard/WelcomeCard";
import StatCard from "../../components/Dashboard/StatCard";
import RecentPredictions from "../../components/Dashboard/RecentPredictions";
import QuickActions from "../../components/Dashboard/QuickActions";

import { getDashboardData } from "../../services/dashboardService";
import appointmentService from "../../services/appointmentService";
import api from "../../services/api";

import { FaHeartPulse, FaTriangleExclamation, FaCalendarCheck, FaCircleCheck, FaLightbulb } from "react-icons/fa6";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState({ upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardAndStats();
  }, []);

  const fetchDashboardAndStats = async () => {
    setLoading(true);
    try {
      // Fetch Dashboard Data
      const dashData = await getDashboardData();
      setDashboard(dashData);

      // Resolve userId safely
      let userId = localStorage.getItem("userId");
      if (!userId || userId === "null" || userId === "undefined") {
        try {
          const profileRes = await api.get("/user/profile");
          if (profileRes.data?.id) {
            userId = String(profileRes.data.id);
            localStorage.setItem("userId", userId);
          }
        } catch (e) {
          console.error("Failed resolving profile for dashboard stats:", e);
        }
      }

      // Fetch Appointments count if userId is valid
      if (userId && userId !== "null" && userId !== "undefined") {
        const aptRes = await appointmentService.getAppointmentsByUser(userId);
        const aptList = Array.isArray(aptRes?.data) ? aptRes.data : Array.isArray(aptRes) ? aptRes : [];
        
        const upcoming = aptList.filter((a) => a.status === "BOOKED" || a.status === "UPCOMING" || a.status === "SCHEDULED").length;
        const completed = aptList.filter((a) => a.status === "COMPLETED").length;
        setAppointmentStats({ upcoming, completed });
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-cyan" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Loading Healthcare Dashboard...</h5>
      </div>
    );
  }

  return (
    <div className="container dashboard-container py-4 fade-in">
      {/* Welcome Hero */}
      <WelcomeCard userName={dashboard.userName} />

      {/* Quick Action Grid Launcher */}
      <div className="mb-4">
        <h5 className="fw-bold text-white mb-3 font-heading">Quick Actions</h5>
        <QuickActions />
      </div>

      {/* 4 Metric Stat Cards */}
      <div className="row g-3 mb-4">
        <StatCard
          title="Total Predictions"
          count={dashboard.totalPredictions}
          icon={<FaHeartPulse />}
          glowColor="cyan"
        />

        <StatCard
          title="High Risk Alerts"
          count={dashboard.highRiskPredictions}
          icon={<FaTriangleExclamation />}
          glowColor="danger"
        />

        <StatCard
          title="Upcoming Visits"
          count={appointmentStats.upcoming}
          icon={<FaCalendarCheck />}
          glowColor="warning"
        />

        <StatCard
          title="Completed Visits"
          count={appointmentStats.completed}
          icon={<FaCircleCheck />}
          glowColor="success"
        />
      </div>

      {/* Recent Predictions & Health Advice Grid */}
      <div className="row g-4">
        <div className="col-lg-6">
          <RecentPredictions
            latestPrediction={dashboard.latestPrediction}
            latestPredictionDate={dashboard.latestPredictionDate}
          />
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-3">
              <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                <FaLightbulb className="text-warning" /> Clinical Wellness Tips
              </h5>
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1 rounded-pill small">
                Daily Guidance
              </span>
            </div>

            <div className="health-tips-list">
              <div className="health-tip-item">
                <span className="fs-5">💧</span>
                <span className="small text-secondary">Maintain 2–3 liters of daily hydration for optimal cellular function.</span>
              </div>
              <div className="health-tip-item">
                <span className="fs-5">🥗</span>
                <span className="small text-secondary">Incorporate fresh leafy vegetables to regulate glycemic markers.</span>
              </div>
              <div className="health-tip-item">
                <span className="fs-5">🏃</span>
                <span className="small text-secondary">Engage in 30 minutes of aerobic activity daily for cardiovascular health.</span>
              </div>
              <div className="health-tip-item">
                <span className="fs-5">😴</span>
                <span className="small text-secondary">Target 7–8 hours of uninterrupted restful sleep for cognitive recovery.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;