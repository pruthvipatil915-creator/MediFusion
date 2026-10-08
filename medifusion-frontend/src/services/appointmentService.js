import api from "./api";

const appointmentService = {

    // Book Appointment
    bookAppointment(userId, appointmentData) {
        return api.post(
            `/appointments/book?userId=${userId}`,
            appointmentData
        );
    },

    // Get All Appointments
    getAllAppointments() {
        return api.get("/appointments");
    },

    // Get Appointment By Id
    getAppointmentById(id) {
        return api.get(`/appointments/${id}`);
    },

    // Get Appointments Of Logged User
    getAppointmentsByUser(userId) {
        return api.get(`/appointments/user/${userId}`);
    },

    // Cancel Appointment
    cancelAppointment(id) {
        return api.put(`/appointments/cancel/${id}`);
    },

    // Delete Appointment
    deleteAppointment(id) {
        return api.delete(`/appointments/${id}`);
    }

};

export default appointmentService;