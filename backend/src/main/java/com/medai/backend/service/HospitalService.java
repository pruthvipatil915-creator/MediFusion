package com.medai.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.HospitalResponseDTO;
import com.medai.backend.entity.Hospital;
import com.medai.backend.exception.ResourceNotFoundException;
import com.medai.backend.repository.HospitalRepository;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    // Entity -> DTO Mapper
    private HospitalResponseDTO mapToDTO(Hospital hospital) {

        return new HospitalResponseDTO(
                hospital.getId(),
                hospital.getHospitalName(),
                hospital.getCity(),
                hospital.getAddress(),
                hospital.getPhone(),
                hospital.getEmail(),
                hospital.getSpecialization());
    }

    // Add Hospital
    public HospitalResponseDTO addHospital(Hospital hospital) {

        Hospital savedHospital = hospitalRepository.save(hospital);

        return mapToDTO(savedHospital);
    }

    // Get All Hospitals
    public List<HospitalResponseDTO> getAllHospitals() {

        return hospitalRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get Hospital By Id
    public HospitalResponseDTO getHospitalById(Long id) {

        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found with ID: " + id));

        return mapToDTO(hospital);
    }

    // Get Hospitals By City
    public List<HospitalResponseDTO> getHospitalsByCity(String city) {

        return hospitalRepository.findByCity(city)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get Hospitals By Specialization
    public List<HospitalResponseDTO> getHospitalsBySpecialization(String specialization) {

        return hospitalRepository.findBySpecialization(specialization)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get Hospitals By City And Specialization
    public List<HospitalResponseDTO> getHospitalsByCityAndSpecialization(
            String city,
            String specialization) {

        return hospitalRepository.findByCityAndSpecialization(city, specialization)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Update Hospital
    public HospitalResponseDTO updateHospital(Long id, Hospital updatedHospital) {

        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found with ID: " + id));

        hospital.setHospitalName(updatedHospital.getHospitalName());
        hospital.setCity(updatedHospital.getCity());
        hospital.setAddress(updatedHospital.getAddress());
        hospital.setPhone(updatedHospital.getPhone());
        hospital.setEmail(updatedHospital.getEmail());
        hospital.setSpecialization(updatedHospital.getSpecialization());

        Hospital savedHospital = hospitalRepository.save(hospital);

        return mapToDTO(savedHospital);
    }

    // Delete Hospital
    public String deleteHospital(Long id) {

        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found with ID: " + id));

        hospitalRepository.delete(hospital);

        return "Hospital Deleted Successfully";
    }
}