package com.medai.backend.dto;

import java.time.LocalDateTime;

public class PredictionItem {

    private String diseaseName;
    private String riskLevel;
    private LocalDateTime predictionDate;

    public PredictionItem() {
    }

    public PredictionItem(String diseaseName, String riskLevel, LocalDateTime predictionDate) {
        this.diseaseName = diseaseName;
        this.riskLevel = riskLevel;
        this.predictionDate = predictionDate;
    }

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public LocalDateTime getPredictionDate() {
        return predictionDate;
    }

    public void setPredictionDate(LocalDateTime predictionDate) {
        this.predictionDate = predictionDate;
    }
}