package com.medai.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.medai.backend.dto.DoctorResponseDTO;
import com.medai.backend.entity.Doctor;
import com.medai.backend.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // ==========================
    // Get All Doctors
    // ==========================
    @GetMapping
    public List<DoctorResponseDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // ==========================
    // Get Doctor By ID
    // ==========================
    @GetMapping("/{id}")
    public DoctorResponseDTO getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    // ==========================
    // Get Doctors By Specialization
    // ==========================
    @GetMapping("/specialization/{specialization}")
    public List<DoctorResponseDTO> getDoctorsBySpecialization(
            @PathVariable String specialization) {

        return doctorService.getDoctorsBySpecialization(specialization);
    }

    // ==========================
    // Get Doctors By City
    // ==========================
    @GetMapping("/city/{city}")
    public List<DoctorResponseDTO> getDoctorsByCity(
            @PathVariable String city) {

        return doctorService.getDoctorsByCity(city);
    }

    // ==========================
    // Search Doctors
    // ==========================
    @GetMapping("/search")
    public List<DoctorResponseDTO> searchDoctors(
            @RequestParam String specialization,
            @RequestParam String city) {

        return doctorService.getDoctorsBySpecializationAndCity(
                specialization, city);
    }

    // ==========================
    // Add Doctor
    // ==========================
    @PostMapping
    public DoctorResponseDTO addDoctor(@RequestBody Doctor doctor) {
        return doctorService.addDoctor(doctor);
    }

    // ==========================
    // Update Doctor
    // ==========================
    @PutMapping("/{id}")
    public DoctorResponseDTO updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctor) {

        return doctorService.updateDoctor(id, doctor);
    }

    // ==========================
    // Delete Doctor
    // ==========================
    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        return doctorService.deleteDoctor(id);
    }
}