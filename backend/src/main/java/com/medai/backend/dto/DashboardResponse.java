package com.medai.backend.dto;

import java.time.LocalDateTime;

public class DashboardResponse {

    private String userName;
    private long totalPredictions;
    private String latestPrediction;
    private LocalDateTime latestPredictionDate;
    private long highRiskPredictions;

    public DashboardResponse() {
    }

    public DashboardResponse(String userName,
                             long totalPredictions,
                             String latestPrediction,
                             LocalDateTime latestPredictionDate,
                             long highRiskPredictions) {
        this.userName = userName;
        this.totalPredictions = totalPredictions;
        this.latestPrediction = latestPrediction;
        this.latestPredictionDate = latestPredictionDate;
        this.highRiskPredictions = highRiskPredictions;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public long getTotalPredictions() {
        return totalPredictions;
    }

    public void setTotalPredictions(long totalPredictions) {
        this.totalPredictions = totalPredictions;
    }

    public String getLatestPrediction() {
        return latestPrediction;
    }

    public void setLatestPrediction(String latestPrediction) {
        this.latestPrediction = latestPrediction;
    }

    public LocalDateTime getLatestPredictionDate() {
        return latestPredictionDate;
    }

    public void setLatestPredictionDate(LocalDateTime latestPredictionDate) {
        this.latestPredictionDate = latestPredictionDate;
    }

    public long getHighRiskPredictions() {
        return highRiskPredictions;
    }

    public void setHighRiskPredictions(long highRiskPredictions) {
        this.highRiskPredictions = highRiskPredictions;
    }
}