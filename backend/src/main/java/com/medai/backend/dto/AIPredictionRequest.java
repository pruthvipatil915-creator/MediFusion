package com.medai.backend.dto;

import java.util.List;

public class AIPredictionRequest {

    private List<String> symptoms;

    public AIPredictionRequest() {
    }

    public AIPredictionRequest(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }
}