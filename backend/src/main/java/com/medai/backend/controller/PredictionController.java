package com.medai.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.medai.backend.dto.PredictionRequest;
import com.medai.backend.dto.PredictionResponse;
import com.medai.backend.service.PredictionService;

@RestController
@RequestMapping("/api/predict")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping
    public PredictionResponse predictDisease(
            Authentication authentication,
            @RequestBody PredictionRequest request) {

        String email = authentication.getName();

        return predictionService.predictDisease(email, request);
    }
}