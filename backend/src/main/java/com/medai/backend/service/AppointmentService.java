package com.medai.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.AppointmentRequestDTO;
import com.medai.backend.dto.AppointmentResponseDTO;
import com.medai.backend.entity.Appointment;
import com.medai.backend.entity.Doctor;
import com.medai.backend.entity.User;
import com.medai.backend.exception.ResourceNotFoundException;
import com.medai.backend.repository.AppointmentRepository;
import com.medai.backend.repository.DoctorRepository;
import com.medai.backend.repository.UserRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // ==========================
    // Entity -> DTO Mapper
    // ==========================
    private AppointmentResponseDTO mapToDTO(Appointment appointment) {

        return new AppointmentResponseDTO(
                appointment.getId(),

                appointment.getUser().getId(),
                appointment.getUser().getFullName(),

                appointment.getDoctor().getId(),
                appointment.getDoctor().getFullName(),

                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),

                appointment.getStatus(),
                appointment.getReason());
    }

 // ==========================
 // Book Appointment
 // ==========================
 public AppointmentResponseDTO bookAppointment(
         Long userId,
         AppointmentRequestDTO requestDTO) {

     // Find User
     User user = userRepository.findById(userId)
             .orElseThrow(() ->
                     new ResourceNotFoundException(
                             "User not found with ID: " + userId));

     // Find Doctor
     Doctor doctor = doctorRepository.findById(requestDTO.getDoctorId())
             .orElseThrow(() ->
                     new ResourceNotFoundException(
                             "Doctor not found with ID: " + requestDTO.getDoctorId()));

     // Check Doctor Availability
     boolean isSlotBooked =
             appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                     requestDTO.getDoctorId(),
                     requestDTO.getAppointmentDate(),
                     requestDTO.getAppointmentTime());

     if (isSlotBooked) {
         throw new IllegalStateException(
                 "Doctor is already booked for the selected date and time.");
     }

     // Create Appointment
     Appointment appointment = new Appointment();

     appointment.setUser(user);
     appointment.setDoctor(doctor);
     appointment.setAppointmentDate(requestDTO.getAppointmentDate());
     appointment.setAppointmentTime(requestDTO.getAppointmentTime());
     appointment.setReason(requestDTO.getReason());
     appointment.setStatus("BOOKED");

     // Save Appointment
     Appointment savedAppointment = appointmentRepository.save(appointment);

     return mapToDTO(savedAppointment);
 }

    // ==========================
    // Get All Appointments
    // ==========================
    public List<AppointmentResponseDTO> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==========================
    // Get Appointment By Id
    // ==========================
    public AppointmentResponseDTO getAppointmentById(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found with ID: " + id));

        return mapToDTO(appointment);
    }

    // ==========================
    // Get Appointments By User
    // ==========================
    public List<AppointmentResponseDTO> getAppointmentsByUser(Long userId) {

        return appointmentRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==========================
    // Get Appointments By Doctor
    // ==========================
    public List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId) {

        return appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==========================
    // Update Appointment
    // ==========================
    public AppointmentResponseDTO updateAppointment(
            Long id,
            Appointment updatedAppointment) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found with ID: " + id));

        appointment.setAppointmentDate(updatedAppointment.getAppointmentDate());
        appointment.setAppointmentTime(updatedAppointment.getAppointmentTime());
        appointment.setReason(updatedAppointment.getReason());
        appointment.setStatus(updatedAppointment.getStatus());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return mapToDTO(savedAppointment);
    }

    // ==========================
    // Cancel Appointment
    // ==========================
    public String cancelAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found with ID: " + id));

        appointment.setStatus("CANCELLED");

        appointmentRepository.save(appointment);

        return "Appointment Cancelled Successfully";
    }

    // ==========================
    // Delete Appointment
    // ==========================
    public String deleteAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found with ID: " + id));

        appointmentRepository.delete(appointment);

        return "Appointment Deleted Successfully";
    }
}