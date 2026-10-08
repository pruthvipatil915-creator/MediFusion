package com.medai.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.medai.backend.dto.AIPredictionRequest;
import com.medai.backend.dto.AIPredictionResponse;
import com.medai.backend.dto.DiseasePredictionResponse;
import com.medai.backend.entity.Disease;
import com.medai.backend.entity.PredictionHistory;
import com.medai.backend.entity.User;
import com.medai.backend.repository.DiseaseRepository;
import com.medai.backend.repository.PredictionHistoryRepository;
import com.medai.backend.repository.UserRepository;

@Service
public class AIService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private DiseaseRepository diseaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PredictionHistoryRepository predictionHistoryRepository;

    public DiseasePredictionResponse predictDisease(AIPredictionRequest request) {

        // Call Flask AI
        AIPredictionResponse aiResponse = restTemplate.postForObject(
                "http://localhost:5000/predict",
                request,
                AIPredictionResponse.class);

        if (aiResponse == null) {
            throw new RuntimeException("Unable to connect to AI Service.");
        }

        if (aiResponse.getPredictedDisease() == null ||
                aiResponse.getPredictedDisease().isBlank()) {

            throw new RuntimeException("AI service returned an empty disease prediction.");
        }

        String predictedDisease =
                normalizeDiseaseName(aiResponse.getPredictedDisease());

        System.out.println("======================================");
        System.out.println("AI Prediction : " + predictedDisease);
        System.out.println("Confidence    : " + aiResponse.getConfidence());
        System.out.println("======================================");

        Optional<Disease> optionalDisease =
                diseaseRepository.findByDiseaseName(predictedDisease);

        if (optionalDisease.isEmpty()) {

            throw new RuntimeException(
                    "Disease not found in database : " + predictedDisease);
        }

        Disease disease = optionalDisease.get();

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Logged in user not found."));

        PredictionHistory history = new PredictionHistory();

        history.setUser(user);
        history.setDisease(disease);
        history.setPredictionDate(LocalDateTime.now());

        predictionHistoryRepository.save(history);

        DiseasePredictionResponse response =
                new DiseasePredictionResponse();

        response.setPredictedDisease(predictedDisease);
        response.setConfidence(aiResponse.getConfidence());

        response.setDescription(disease.getDescription());
        response.setSymptoms(disease.getSymptoms());
        response.setCauses(disease.getCauses());
        response.setTreatment(disease.getTreatment());
        response.setMedicines(disease.getMedicines());
        response.setPrecautions(disease.getPrecautions());
        response.setRiskLevel(disease.getRiskLevel());
        response.setSpecialistDoctor(disease.getSpecialistDoctor());
        response.setEstimatedRecoveryTime(disease.getEstimatedRecoveryTime());
        response.setEmergencyWarning(disease.getEmergencyWarning());

        response.setTop3Predictions(aiResponse.getTop3Predictions());
        response.setImportantSymptoms(aiResponse.getImportantSymptoms());
        response.setDisclaimer(aiResponse.getDisclaimer());

        return response;
    }

    public com.medai.backend.dto.SpecializedPredictionResponse predictDiabetes(
            com.medai.backend.dto.DiabetesPredictionRequest request) {

        com.medai.backend.dto.SpecializedPredictionResponse response =
                restTemplate.postForObject(
                        "http://localhost:5000/api/ml/diabetes/predict",
                        request,
                        com.medai.backend.dto.SpecializedPredictionResponse.class);

        if (response == null) {
            throw new RuntimeException("Unable to connect to Diabetes Risk AI Service.");
        }

        return response;
    }

    public com.medai.backend.dto.SpecializedPredictionResponse predictHeart(
            com.medai.backend.dto.HeartPredictionRequest request) {

        com.medai.backend.dto.SpecializedPredictionResponse response =
                restTemplate.postForObject(
                        "http://localhost:5000/api/ml/heart/predict",
                        request,
                        com.medai.backend.dto.SpecializedPredictionResponse.class);

        if (response == null) {
            throw new RuntimeException("Unable to connect to Heart Disease Risk AI Service.");
        }

        return response;
    }

    private String normalizeDiseaseName(String disease) {

        if (disease == null) {
            return "";
        }

        disease = disease.trim();

        return switch (disease) {

            case "Diabetes " -> "Diabetes";
            case "Hypertension " -> "Hypertension";
            case "Heart attack" -> "Heart Attack";
            case "Varicose veins" -> "Varicose Veins";
            case "Urinary tract infection" -> "Urinary Tract Infection";
            case "Paralysis (brain hemorrhage)" -> "Paralysis (Brain Hemorrhage)";
            case "Dimorphic hemmorhoids(piles)" -> "Dimorphic Hemorrhoids (Piles)";
            case "Peptic ulcer diseae" -> "Peptic ulcer disease";
            case "Osteoarthristis" -> "Osteoarthritis";
            case "(vertigo) Paroymsal Positional Vertigo" -> "Vertigo";

            default -> disease;
        };
    }
}