package com.medai.backend.service;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.AIPredictionRequest;
import com.medai.backend.dto.DiseasePredictionResponse;
import com.medai.backend.dto.PredictionRequest;
import com.medai.backend.dto.PredictionResponse;

@Service
public class PredictionService {

    @Autowired
    private AIService aiService;

    public PredictionResponse predictDisease(String email, PredictionRequest request) {

        String rawSymptoms = request.getSymptoms() != null ? request.getSymptoms() : "";
        java.util.List<String> symptomList = Arrays.stream(rawSymptoms.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.toList());

        AIPredictionRequest aiRequest = new AIPredictionRequest(symptomList);
        DiseasePredictionResponse aiResp = aiService.predictDisease(aiRequest);

        return new PredictionResponse(
                aiResp.getPredictedDisease(),
                aiResp.getDescription(),
                aiResp.getSymptoms(),
                aiResp.getTreatment(),
                aiResp.getMedicines(),
                aiResp.getPrecautions(),
                aiResp.getRiskLevel(),
                aiResp.getSpecialistDoctor()
        );
    }
}