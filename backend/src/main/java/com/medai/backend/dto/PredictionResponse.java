package com.medai.backend.dto;

public class PredictionResponse {

    private String diseaseName;
    private String description;
    private String symptoms;
    private String treatment;
    private String medicines;
    private String precautions;
    private String riskLevel;
    private String specialistDoctor;

    public PredictionResponse() {
    }

    public PredictionResponse(String diseaseName, String description, String symptoms,
                              String treatment, String medicines, String precautions,
                              String riskLevel, String specialistDoctor) {
        this.diseaseName = diseaseName;
        this.description = description;
        this.symptoms = symptoms;
        this.treatment = treatment;
        this.medicines = medicines;
        this.precautions = precautions;
        this.riskLevel = riskLevel;
        this.specialistDoctor = specialistDoctor;
    }

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getMedicines() {
        return medicines;
    }

    public void setMedicines(String medicines) {
        this.medicines = medicines;
    }

    public String getPrecautions() {
        return precautions;
    }

    public void setPrecautions(String precautions) {
        this.precautions = precautions;
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
}