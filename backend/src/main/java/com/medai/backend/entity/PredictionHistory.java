package com.medai.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "prediction_history")
public class PredictionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who made the prediction
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Predicted disease
    @ManyToOne
    @JoinColumn(name = "disease_id")
    private Disease disease;

    // Date & Time of prediction
    private LocalDateTime predictionDate;

    // Default Constructor
    public PredictionHistory() {
    }

    // Parameterized Constructor
    public PredictionHistory(Long id, User user, Disease disease, LocalDateTime predictionDate) {
        this.id = id;
        this.user = user;
        this.disease = disease;
        this.predictionDate = predictionDate;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Disease getDisease() {
        return disease;
    }

    public void setDisease(Disease disease) {
        this.disease = disease;
    }

    public LocalDateTime getPredictionDate() {
        return predictionDate;
    }

    public void setPredictionDate(LocalDateTime predictionDate) {
        this.predictionDate = predictionDate;
    }
}