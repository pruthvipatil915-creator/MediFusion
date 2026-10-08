import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ChatbotButton from "./components/Chatbot/ChatbotButton";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Prediction from "./pages/Prediction/Prediction";
import History from "./pages/History/History";
import Hospitals from "./pages/Hospitals/Hospitals";
import Appointments from "./pages/Appointment/Appointments";
import MyAppointments from "./pages/MyAppointments/MyAppointments";
import Profile from "./pages/Profile/Profile";
import Chatbot from "./pages/Chatbot/Chatbot";
import DoctorDetails from "./pages/Doctor/DoctorDetails";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";

// Admin Module Pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminDoctors from "./pages/Admin/AdminDoctors";
import AdminHospitals from "./pages/Admin/AdminHospitals";
import AdminAppointments from "./pages/Admin/AdminAppointments";
import AdminPredictions from "./pages/Admin/AdminPredictions";
import AdminUsers from "./pages/Admin/AdminUsers";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RoleGuard from "./components/RoleGuard/RoleGuard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/history" element={<History />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/doctors" element={<Hospitals />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Route>

        {/* Doctor Routes */}
        <Route element={<RoleGuard requiredRole="DOCTOR" />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<RoleGuard requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="hospitals" element={<AdminHospitals />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="predictions" element={<AdminPredictions />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>

      {/* Global Floating AI Chatbot Assistant */}
      <ChatbotButton />

      <Footer />
    </>
  );
}

export default App;