package com.medai.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medai.backend.dto.HospitalResponseDTO;
import com.medai.backend.entity.Hospital;
import com.medai.backend.service.HospitalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    // Add Hospital
    @PostMapping
    public ResponseEntity<HospitalResponseDTO> addHospital(
            @Valid @RequestBody Hospital hospital) {

        HospitalResponseDTO response = hospitalService.addHospital(hospital);

        return ResponseEntity.ok(response);
    }

    // Get All Hospitals
    @GetMapping
    public ResponseEntity<List<HospitalResponseDTO>> getAllHospitals() {

        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    // Get Hospital By Id
    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponseDTO> getHospitalById(
            @PathVariable Long id) {

        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    // Get Hospitals By City
    @GetMapping("/city/{city}")
    public ResponseEntity<List<HospitalResponseDTO>> getHospitalsByCity(
            @PathVariable String city) {

        return ResponseEntity.ok(hospitalService.getHospitalsByCity(city));
    }

    // Get Hospitals By Specialization
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<HospitalResponseDTO>> getHospitalsBySpecialization(
            @PathVariable String specialization) {

        return ResponseEntity.ok(
                hospitalService.getHospitalsBySpecialization(specialization));
    }

    // Search Hospitals By City And Specialization
    @GetMapping("/search")
    public ResponseEntity<List<HospitalResponseDTO>> searchHospitals(
            @RequestParam String city,
            @RequestParam String specialization) {

        return ResponseEntity.ok(
                hospitalService.getHospitalsByCityAndSpecialization(
                        city,
                        specialization));
    }

    // Update Hospital
    @PutMapping("/{id}")
    public ResponseEntity<HospitalResponseDTO> updateHospital(
            @PathVariable Long id,
            @Valid @RequestBody Hospital hospital) {

        HospitalResponseDTO response =
                hospitalService.updateHospital(id, hospital);

        return ResponseEntity.ok(response);
    }

    // Delete Hospital
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(
            @PathVariable Long id) {

        hospitalService.deleteHospital(id);

        return ResponseEntity.noContent().build();
    }

}