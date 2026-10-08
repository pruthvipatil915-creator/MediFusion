package com.medai.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.DashboardResponse;
import com.medai.backend.entity.PredictionHistory;
import com.medai.backend.entity.User;
import com.medai.backend.repository.PredictionHistoryRepository;
import com.medai.backend.repository.UserRepository;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PredictionHistoryRepository predictionHistoryRepository;

    public DashboardResponse getDashboard(String email) {

        // Get logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        // Total predictions
        long totalPredictions =
                predictionHistoryRepository.countByUser(user);

     // Latest prediction
        Optional<PredictionHistory> latestPrediction =
                predictionHistoryRepository.findTopByUserOrderByPredictionDateDesc(user);

        DashboardResponse response = new DashboardResponse();

        response.setUserName(user.getFullName());
        response.setTotalPredictions(totalPredictions);

        if (latestPrediction.isPresent()) {

            PredictionHistory history = latestPrediction.get();

            response.setLatestPrediction(
                    history.getDisease().getDiseaseName());

            response.setLatestPredictionDate(
                    history.getPredictionDate());

            long highRiskCount =
                    predictionHistoryRepository
                            .countByUserAndDisease_RiskLevel(user, "High");

            response.setHighRiskPredictions(highRiskCount);

        } else {

            response.setLatestPrediction("No Prediction Yet");
            response.setLatestPredictionDate(null);
            response.setHighRiskPredictions(0);
        }

        return response;
    }
}