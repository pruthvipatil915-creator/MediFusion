package com.medai.backend.dto;

import java.time.LocalDateTime;

public class PredictionHistoryResponse {

    private Long id;
    private String diseaseName;
    private String riskLevel;
    private String specialistDoctor;
    private LocalDateTime predictionDate;

    public PredictionHistoryResponse() {
    }

    public PredictionHistoryResponse(Long id,
                                     String diseaseName,
                                     String riskLevel,
                                     String specialistDoctor,
                                     LocalDateTime predictionDate) {
        this.id = id;
        this.diseaseName = diseaseName;
        this.riskLevel = riskLevel;
        this.specialistDoctor = specialistDoctor;
        this.predictionDate = predictionDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getSpecialistDoctor() {
        return specialistDoctor;
    }

    public void setSpecialistDoctor(String specialistDoctor) {
        this.specialistDoctor = specialistDoctor;
    }

    public LocalDateTime getPredictionDate() {
        return predictionDate;
    }

    public void setPredictionDate(LocalDateTime predictionDate) {
        this.predictionDate = predictionDate;
    }
}