package com.medai.backend.dto;

public class DiseaseResponseDTO {

    private Long id;
    private String diseaseCode;
    private String diseaseName;
    private String description;
    private String symptoms;
    private String causes;
    private String treatment;
    private String medicines;
    private String precautions;
    private String riskLevel;
    private String specialistDoctor;
    private String estimatedRecoveryTime;
    private String emergencyWarning;

    public DiseaseResponseDTO() {
    }

    public DiseaseResponseDTO(
            Long id,
            String diseaseCode,
            String diseaseName,
            String description,
            String symptoms,
            String causes,
            String treatment,
            String medicines,
            String precautions,
            String riskLevel,
            String specialistDoctor,
            String estimatedRecoveryTime,
            String emergencyWarning) {

        this.id = id;
        this.diseaseCode = diseaseCode;
        this.diseaseName = diseaseName;
        this.description = description;
        this.symptoms = symptoms;
        this.causes = causes;
        this.treatment = treatment;
        this.medicines = medicines;
        this.precautions = precautions;
        this.riskLevel = riskLevel;
        this.specialistDoctor = specialistDoctor;
        this.estimatedRecoveryTime = estimatedRecoveryTime;
        this.emergencyWarning = emergencyWarning;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDiseaseCode() {
        return diseaseCode;
    }

    public void setDiseaseCode(String diseaseCode) {
        this.diseaseCode = diseaseCode;
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
}