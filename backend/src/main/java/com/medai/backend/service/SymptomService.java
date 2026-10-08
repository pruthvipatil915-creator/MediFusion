package com.medai.backend.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.SymptomResponse;
import com.medai.backend.entity.Disease;
import com.medai.backend.repository.DiseaseRepository;

@Service
public class SymptomService {

    @Autowired
    private DiseaseRepository diseaseRepository;

    public List<SymptomResponse> getAllSymptoms() {

        List<Disease> diseases = diseaseRepository.findAll();

        Set<String> uniqueSymptoms = new LinkedHashSet<>();

        for (Disease disease : diseases) {

            if (disease.getSymptoms() == null) {
                continue;
            }

            String[] symptoms = disease.getSymptoms().split(",");

            for (String symptom : symptoms) {

                uniqueSymptoms.add(symptom.trim());

            }

        }

        List<SymptomResponse> response = new ArrayList<>();

        for (String symptom : uniqueSymptoms) {

            response.add(new SymptomResponse(symptom));

        }

        return response;

    }

}