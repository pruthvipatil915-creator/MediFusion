package com.medai.backend.dto;

import java.util.List;
import java.util.Map;

public class SpecializedPredictionResponse {

    private String model;
    private String version;
    private String riskAssessment;
    private Double probability;
    private String riskLevel;
    private List<Map<String, Object>> importantFeatures;
    private String disclaimer;

    public SpecializedPredictionResponse() {
    }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getRiskAssessment() { return riskAssessment; }
    public void setRiskAssessment(String riskAssessment) { this.riskAssessment = riskAssessment; }

    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public List<Map<String, Object>> getImportantFeatures() { return importantFeatures; }
    public void setImportantFeatures(List<Map<String, Object>> importantFeatures) { this.importantFeatures = importantFeatures; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
