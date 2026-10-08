package com.medai.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.medai.backend.dto.AppointmentRequestDTO;
import com.medai.backend.dto.AppointmentResponseDTO;
import com.medai.backend.entity.Appointment;
import com.medai.backend.service.AppointmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // ==========================
    // Book Appointment
    // ==========================
    @PostMapping("/book")
    public AppointmentResponseDTO bookAppointment(
            @RequestParam Long userId,
            @Valid @RequestBody AppointmentRequestDTO requestDTO) {

        return appointmentService.bookAppointment(userId, requestDTO);
    }

    // ==========================
    // Get All Appointments
    // ==========================
    @GetMapping
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // ==========================
    // Get Appointment By ID
    // ==========================
    @GetMapping("/{id}")
    public AppointmentResponseDTO getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    // ==========================
    // Get Appointments By User
    // ==========================
    @GetMapping("/user/{userId}")
    public List<AppointmentResponseDTO> getAppointmentsByUser(
            @PathVariable Long userId) {

        return appointmentService.getAppointmentsByUser(userId);
    }

    // ==========================
    // Get Appointments By Doctor
    // ==========================
    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponseDTO> getAppointmentsByDoctor(
            @PathVariable Long doctorId) {

        return appointmentService.getAppointmentsByDoctor(doctorId);
    }

    // ==========================
    // Update Appointment
    // ==========================
    @PutMapping("/{id}")
    public AppointmentResponseDTO updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment) {

        return appointmentService.updateAppointment(id, appointment);
    }

    // ==========================
    // Cancel Appointment
    // ==========================
    @PutMapping("/cancel/{id}")
    public String cancelAppointment(@PathVariable Long id) {
        return appointmentService.cancelAppointment(id);
    }

    // ==========================
    // Delete Appointment
    // ==========================
    @DeleteMapping("/{id}")
    public String deleteAppointment(@PathVariable Long id) {
        return appointmentService.deleteAppointment(id);
    }
}