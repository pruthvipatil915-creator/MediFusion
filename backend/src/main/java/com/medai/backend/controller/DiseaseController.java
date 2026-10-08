package com.medai.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.medai.backend.dto.DiseaseResponseDTO;
import com.medai.backend.entity.Disease;
import com.medai.backend.service.DiseaseService;

@RestController
@RequestMapping("/api/diseases")
public class DiseaseController {

    @Autowired
    private DiseaseService diseaseService;

    // ==========================
    // Add Disease
    // ==========================
    @PostMapping
    public DiseaseResponseDTO addDisease(@RequestBody Disease disease) {
        return diseaseService.addDisease(disease);
    }

    // ==========================
    // Get All Diseases
    // ==========================
    @GetMapping
    public List<DiseaseResponseDTO> getAllDiseases() {
        return diseaseService.getAllDiseases();
    }

    // ==========================
    // Get Disease By ID
    // ==========================
    @GetMapping("/{id}")
    public DiseaseResponseDTO getDiseaseById(@PathVariable Long id) {
        return diseaseService.getDiseaseById(id);
    }

    // ==========================
    // Update Disease
    // ==========================
    @PutMapping("/{id}")
    public DiseaseResponseDTO updateDisease(
            @PathVariable Long id,
            @RequestBody Disease disease) {

        return diseaseService.updateDisease(id, disease);
    }

    // ==========================
    // Delete Disease
    // ==========================
    @DeleteMapping("/{id}")
    public String deleteDisease(@PathVariable Long id) {
        return diseaseService.deleteDisease(id);
    }
}