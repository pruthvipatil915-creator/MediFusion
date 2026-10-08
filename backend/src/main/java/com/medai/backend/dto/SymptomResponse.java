package com.medai.backend.dto;

public class SymptomResponse {

    private String symptom;

    public SymptomResponse() {
    }

    public SymptomResponse(String symptom) {
        this.symptom = symptom;
    }

    public String getSymptom() {
        return symptom;
    }

    public void setSymptom(String symptom) {
        this.symptom = symptom;
    }

}