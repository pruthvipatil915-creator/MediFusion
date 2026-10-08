package com.medai.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.DoctorResponseDTO;
import com.medai.backend.entity.Doctor;
import com.medai.backend.exception.ResourceNotFoundException;
import com.medai.backend.repository.DoctorRepository;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // ==========================
    // Entity -> DTO Mapper
    // ==========================
    private DoctorResponseDTO mapToDTO(Doctor doctor) {

        return new DoctorResponseDTO(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getSpecialization(),
                doctor.getHospitalName(),
                doctor.getCity(),
                doctor.getExperience(),
                doctor.getAvailableDays(),
                doctor.getAvailableTime(),
                doctor.getConsultationFee(),
                doctor.getPhone());
    }

    // ==========================
    // Get All Doctors
    // ==========================
    public List<DoctorResponseDTO> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==========================
    // Get Doctor By ID
    // ==========================
    public DoctorResponseDTO getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with ID: " + id));

        return mapToDTO(doctor);
    }

    // ==========================
    // Get Doctors By Specialization
    // ==========================
    public List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization) {

        return doctorRepository.findBySpecialization(specialization)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==========================
    // Get Doctors By City
    // ==========================
    public List<DoctorResponseDTO> getDoctorsByCity(String city) {

        return doctorRepository.findByCity(city)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==========================
    // Get Doctors By Specialization And City
    // ==========================
    public List<DoctorResponseDTO> getDoctorsBySpecializationAndCity(
            String specialization,
            String city) {

        return doctorRepository.findBySpecializationAndCity(specialization, city)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==========================
    // Add New Doctor
    // ==========================
    public DoctorResponseDTO addDoctor(Doctor doctor) {

        Doctor savedDoctor = doctorRepository.save(doctor);

        return mapToDTO(savedDoctor);
    }

    // ==========================
    // Update Doctor
    // ==========================
    public DoctorResponseDTO updateDoctor(Long id, Doctor updatedDoctor) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with ID: " + id));

        doctor.setFullName(updatedDoctor.getFullName());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setHospitalName(updatedDoctor.getHospitalName());
        doctor.setCity(updatedDoctor.getCity());
        doctor.setExperience(updatedDoctor.getExperience());
        doctor.setAvailableDays(updatedDoctor.getAvailableDays());
        doctor.setAvailableTime(updatedDoctor.getAvailableTime());
        doctor.setConsultationFee(updatedDoctor.getConsultationFee());
        doctor.setPhone(updatedDoctor.getPhone());

        Doctor savedDoctor = doctorRepository.save(doctor);

        return mapToDTO(savedDoctor);
    }

    // ==========================
    // Delete Doctor
    // ==========================
    public String deleteDoctor(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with ID: " + id));

        doctorRepository.delete(doctor);

        return "Doctor deleted successfully.";
    }
}