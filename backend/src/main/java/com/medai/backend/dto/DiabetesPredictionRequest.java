package com.medai.backend.dto;

public class DiabetesPredictionRequest {

    private Double pregnancies = 0.0;
    private Double glucose = 100.0;
    private Double bloodPressure = 70.0;
    private Double skinThickness = 20.0;
    private Double insulin = 80.0;
    private Double bmi = 25.0;
    private Double diabetesPedigree = 0.5;
    private Double age = 30.0;

    public DiabetesPredictionRequest() {
    }

    public Double getPregnancies() { return pregnancies; }
    public void setPregnancies(Double pregnancies) { this.pregnancies = pregnancies; }

    public Double getGlucose() { return glucose; }
    public void setGlucose(Double glucose) { this.glucose = glucose; }

    public Double getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(Double bloodPressure) { this.bloodPressure = bloodPressure; }

    public Double getSkinThickness() { return skinThickness; }
    public void setSkinThickness(Double skinThickness) { this.skinThickness = skinThickness; }

    public Double getInsulin() { return insulin; }
    public void setInsulin(Double insulin) { this.insulin = insulin; }

    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }

    public Double getDiabetesPedigree() { return diabetesPedigree; }
    public void setDiabetesPedigree(Double diabetesPedigree) { this.diabetesPedigree = diabetesPedigree; }

    public Double getAge() { return age; }
    public void setAge(Double age) { this.age = age; }
}
