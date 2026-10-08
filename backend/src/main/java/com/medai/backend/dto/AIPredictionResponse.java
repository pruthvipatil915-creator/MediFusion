package com.medai.backend.dto;

import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIPredictionResponse {

    @JsonAlias({"predictedDisease", "predicted_disease"})
    private String predictedDisease;

    private double confidence;

    private List<Map<String, Object>> top3Predictions;
    private List<Map<String, Object>> importantSymptoms;
    private String disclaimer;

    public AIPredictionResponse() {
    }

    public AIPredictionResponse(String predictedDisease, double confidence) {
        this.predictedDisease = predictedDisease;
        this.confidence = confidence;
    }

    public String getPredictedDisease() {
        return predictedDisease;
    }

    public void setPredictedDisease(String predictedDisease) {
        this.predictedDisease = predictedDisease;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public List<Map<String, Object>> getTop3Predictions() {
        return top3Predictions;
    }

    public void setTop3Predictions(List<Map<String, Object>> top3Predictions) {
        this.top3Predictions = top3Predictions;
    }

    public List<Map<String, Object>> getImportantSymptoms() {
        return importantSymptoms;
    }

    public void setImportantSymptoms(List<Map<String, Object>> importantSymptoms) {
        this.importantSymptoms = importantSymptoms;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }

    @Override
    public String toString() {
        return "AIPredictionResponse{" +
                "predictedDisease='" + predictedDisease + '\'' +
                ", confidence=" + confidence +
                '}';
    }
}