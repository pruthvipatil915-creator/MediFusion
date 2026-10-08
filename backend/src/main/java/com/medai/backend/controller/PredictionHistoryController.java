package com.medai.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medai.backend.dto.PredictionHistoryResponse;
import com.medai.backend.service.PredictionHistoryService;

@RestController
public class PredictionHistoryController {

    @Autowired
    private PredictionHistoryService predictionHistoryService;

    @GetMapping("/api/history")
    public List<PredictionHistoryResponse> getHistory(Authentication authentication) {

        return predictionHistoryService.getUserHistory(authentication.getName());
    }
}