package com.medai.backend.service;
import com.medai.backend.exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.PredictionHistoryResponse;
import com.medai.backend.entity.Disease;
import com.medai.backend.entity.PredictionHistory;
import com.medai.backend.entity.User;
import com.medai.backend.repository.PredictionHistoryRepository;
import com.medai.backend.repository.UserRepository;

@Service
public class PredictionHistoryService {

    @Autowired
    private PredictionHistoryRepository predictionHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    // Save Prediction
    public PredictionHistory savePrediction(User user, Disease disease) {

        PredictionHistory history = new PredictionHistory();

        history.setUser(user);
        history.setDisease(disease);
        history.setPredictionDate(LocalDateTime.now());

        return predictionHistoryRepository.save(history);
    }

    // Get Logged-in User Prediction History
    public List<PredictionHistoryResponse> getUserHistory(String email) {

    	User user = userRepository.findByEmail(email)
    	        .orElseThrow(() ->
    	                new ResourceNotFoundException("User not found"));

        List<PredictionHistory> historyList =
                predictionHistoryRepository.findByUser(user);

        return historyList.stream()
                .map(history -> new PredictionHistoryResponse(
                        history.getId(),
                        history.getDisease().getDiseaseName(),
                        history.getDisease().getRiskLevel(),
                        history.getDisease().getSpecialistDoctor(),
                        history.getPredictionDate()
                ))
                .collect(Collectors.toList());
    }
}