package com.medai.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medai.backend.dto.SymptomResponse;
import com.medai.backend.service.SymptomService;

@RestController
public class SymptomController {

    @Autowired
    private SymptomService symptomService;

    @GetMapping("/api/symptoms")
    public List<SymptomResponse> getSymptoms() {

        return symptomService.getAllSymptoms();

    }

}