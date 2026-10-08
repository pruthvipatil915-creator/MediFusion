package com.medai.backend.dto;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "predictedDisease",
    "confidence",
    "description",
    "symptoms",
    "causes",
    "treatment",
    "medicines",
    "precautions",
    "riskLevel",
    "specialistDoctor",
    "estimatedRecoveryTime",
    "emergencyWarning"
})
public class DiseasePredictionResponse {

    private String predictedDisease;
    private double confidence;

    private String description;
    private String symptoms;
    private String causes;
    private String treatment;
    private String medicines;
    private String precautions;
    private String riskLevel;
    private String specialistDoctor;

    // New Fields
    private String estimatedRecoveryTime;
    private String emergencyWarning;

    private java.util.List<java.util.Map<String, Object>> top3Predictions;
    private java.util.List<java.util.Map<String, Object>> importantSymptoms;
    private String disclaimer;

    public DiseasePredictionResponse() {
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

    public String getCauses() {
        return causes;
    }

    public void setCauses(String causes) {
        this.causes = causes;
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

    public String getEstimatedRecoveryTime() {
        return estimatedRecoveryTime;
    }

    public void setEstimatedRecoveryTime(String estimatedRecoveryTime) {
        this.estimatedRecoveryTime = estimatedRecoveryTime;
    }

    public String getEmergencyWarning() {
        return emergencyWarning;
    }

    public void setEmergencyWarning(String emergencyWarning) {
        this.emergencyWarning = emergencyWarning;
    }

    public java.util.List<java.util.Map<String, Object>> getTop3Predictions() {
        return top3Predictions;
    }

    public void setTop3Predictions(java.util.List<java.util.Map<String, Object>> top3Predictions) {
        this.top3Predictions = top3Predictions;
    }

    public java.util.List<java.util.Map<String, Object>> getImportantSymptoms() {
        return importantSymptoms;
    }

    public void setImportantSymptoms(java.util.List<java.util.Map<String, Object>> importantSymptoms) {
        this.importantSymptoms = importantSymptoms;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}