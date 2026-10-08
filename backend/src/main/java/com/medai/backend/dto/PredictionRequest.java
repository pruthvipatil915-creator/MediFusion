package com.medai.backend.dto;

public class PredictionRequest {

    private String symptoms;

    public PredictionRequest() {
    }

    public PredictionRequest(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }
}