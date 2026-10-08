import api from "./api";

// Doctors CRUD
export const getAdminDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post("/doctors", doctorData);
  return response.data;
};

export const updateDoctor = async (id, doctorData) => {
  const response = await api.put(`/doctors/${id}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};

// Hospitals CRUD
export const getAdminHospitals = async () => {
  const response = await api.get("/hospitals");
  return response.data;
};

export const createHospital = async (hospitalData) => {
  const response = await api.post("/hospitals", hospitalData);
  return response.data;
};

export const updateHospital = async (id, hospitalData) => {
  const response = await api.put(`/hospitals/${id}`, hospitalData);
  return response.data;
};

export const deleteHospital = async (id) => {
  const response = await api.delete(`/hospitals/${id}`);
  return response.data;
};

// Appointments Management
export const getAdminAppointments = async () => {
  const response = await api.get("/appointments");
  return response.data;
};

export const cancelAdminAppointment = async (id) => {
  const response = await api.put(`/appointments/cancel/${id}`);
  return response.data;
};

export const deleteAdminAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};

// Users Management
export const getAdminUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Dashboard / Analytics
export const getAdminStats = async () => {
  try {
    const [doctorsRes, hospitalsRes, appointmentsRes] = await Promise.allSettled([
      api.get("/doctors"),
      api.get("/hospitals"),
      api.get("/appointments"),
    ]);

    const doctors = doctorsRes.status === "fulfilled" && Array.isArray(doctorsRes.value?.data) ? doctorsRes.value.data : [];
    const hospitals = hospitalsRes.status === "fulfilled" && Array.isArray(hospitalsRes.value?.data) ? hospitalsRes.value.data : [];
    const appointments = appointmentsRes.status === "fulfilled" && Array.isArray(appointmentsRes.value?.data) ? appointmentsRes.value.data : [];

    return {
      totalDoctors: doctors.length,
      totalHospitals: hospitals.length,
      totalAppointments: appointments.length,
      upcomingAppointments: appointments.filter(a => a.status === "BOOKED" || a.status === "UPCOMING" || a.status === "SCHEDULED").length,
      completedAppointments: appointments.filter(a => a.status === "COMPLETED").length,
      cancelledAppointments: appointments.filter(a => a.status === "CANCELLED").length,
    };
  } catch (err) {
    console.error("Admin stats aggregation error:", err);
    return {
      totalDoctors: 0,
      totalHospitals: 0,
      totalAppointments: 0,
      upcomingAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
    };
  }
};

export default {
  getAdminDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAdminHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  getAdminAppointments,
  cancelAdminAppointment,
  deleteAdminAppointment,
  getAdminStats,
};
