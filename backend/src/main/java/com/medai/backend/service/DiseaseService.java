package com.medai.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.DiseaseResponseDTO;
import com.medai.backend.entity.Disease;
import com.medai.backend.exception.ResourceNotFoundException;
import com.medai.backend.repository.DiseaseRepository;

@Service
public class DiseaseService {

    @Autowired
    private DiseaseRepository diseaseRepository;

    // ==========================
    // Entity -> DTO Mapper
    // ==========================
    private DiseaseResponseDTO mapToDTO(Disease disease) {

        return new DiseaseResponseDTO(
                disease.getId(),
                disease.getDiseaseCode(),
                disease.getDiseaseName(),
                disease.getDescription(),
                disease.getSymptoms(),
                disease.getCauses(),
                disease.getTreatment(),
                disease.getMedicines(),
                disease.getPrecautions(),
                disease.getRiskLevel(),
                disease.getSpecialistDoctor(),
                disease.getEstimatedRecoveryTime(),
                disease.getEmergencyWarning());
    }

    // ==========================
    // Add Disease
    // ==========================
    public DiseaseResponseDTO addDisease(Disease disease) {

        Disease savedDisease = diseaseRepository.save(disease);

        return mapToDTO(savedDisease);
    }

    // ==========================
    // Get All Diseases
    // ==========================
    public List<DiseaseResponseDTO> getAllDiseases() {

        return diseaseRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ==========================
    // Get Disease By ID
    // ==========================
    public DiseaseResponseDTO getDiseaseById(Long id) {

        Disease disease = diseaseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Disease not found with ID: " + id));

        return mapToDTO(disease);
    }

    // ==========================
    // Update Disease
    // ==========================
    public DiseaseResponseDTO updateDisease(Long id, Disease updatedDisease) {

        Disease disease = diseaseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Disease not found with ID: " + id));

        disease.setDiseaseName(updatedDisease.getDiseaseName());
        disease.setDescription(updatedDisease.getDescription());
        disease.setSymptoms(updatedDisease.getSymptoms());
        disease.setCauses(updatedDisease.getCauses());
        disease.setTreatment(updatedDisease.getTreatment());
        disease.setMedicines(updatedDisease.getMedicines());
        disease.setPrecautions(updatedDisease.getPrecautions());
        disease.setRiskLevel(updatedDisease.getRiskLevel());
        disease.setSpecialistDoctor(updatedDisease.getSpecialistDoctor());
        disease.setEstimatedRecoveryTime(updatedDisease.getEstimatedRecoveryTime());
        disease.setEmergencyWarning(updatedDisease.getEmergencyWarning());

        Disease savedDisease = diseaseRepository.save(disease);

        return mapToDTO(savedDisease);
    }

    // ==========================
    // Delete Disease
    // ==========================
    public String deleteDisease(Long id) {

        Disease disease = diseaseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Disease not found with ID: " + id));

        diseaseRepository.delete(disease);

        return "Disease deleted successfully";
    }
}