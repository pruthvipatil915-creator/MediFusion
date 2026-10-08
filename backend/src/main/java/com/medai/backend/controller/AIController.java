package com.medai.backend.controller;

import com.medai.backend.dto.AIPredictionRequest;
import com.medai.backend.dto.DiseasePredictionResponse;
import com.medai.backend.service.AIService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/predict")
    public DiseasePredictionResponse predictDisease(
            @RequestBody AIPredictionRequest request) {

        return aiService.predictDisease(request);
    }

    @PostMapping("/predict/diabetes")
    public com.medai.backend.dto.SpecializedPredictionResponse predictDiabetes(
            @RequestBody com.medai.backend.dto.DiabetesPredictionRequest request) {

        return aiService.predictDiabetes(request);
    }

    @PostMapping("/predict/heart")
    public com.medai.backend.dto.SpecializedPredictionResponse predictHeart(
            @RequestBody com.medai.backend.dto.HeartPredictionRequest request) {

        return aiService.predictHeart(request);
    }
}