package com.medai.backend.config;

import java.io.InputStreamReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.medai.backend.entity.Disease;
import com.medai.backend.repository.DiseaseRepository;
import com.opencsv.CSVReader;

@Component
public class CsvDataLoader implements CommandLineRunner {

    @Autowired
    private DiseaseRepository diseaseRepository;

    @Override
    public void run(String... args) throws Exception {

        // Prevent duplicate imports every time the application starts
        if (diseaseRepository.count() > 0) {
            System.out.println("Disease data already exists. Skipping CSV import.");
            return;
        }

        System.out.println("====================================");
        System.out.println("Loading Disease Dataset...");
        System.out.println("====================================");

        ClassPathResource resource = new ClassPathResource("disease_dataset_v2.csv");

        CSVReader csvReader = new CSVReader(
                new InputStreamReader(resource.getInputStream()));

        // Skip CSV header
        csvReader.readNext();

        String[] line;

        while ((line = csvReader.readNext()) != null) {

            Disease disease = new Disease();

            disease.setDiseaseCode(line[0]);
            disease.setDiseaseName(line[1]);
            disease.setDescription(line[2]);
            disease.setSymptoms(line[3]);
            disease.setCauses(line[4]);
            disease.setTreatment(line[5]);
            disease.setMedicines(line[6]);
            disease.setPrecautions(line[7]);
            disease.setRiskLevel(line[8]);
            disease.setSpecialistDoctor(line[9]);
            disease.setEstimatedRecoveryTime(line[10]);
            disease.setEmergencyWarning(line[11]);

            diseaseRepository.save(disease);

            System.out.println("Imported: " + disease.getDiseaseName());
        }

        csvReader.close();

        System.out.println("====================================");
        System.out.println("CSV Import Completed Successfully");
        System.out.println("Total Diseases Imported : " + diseaseRepository.count());
        System.out.println("====================================");
    }
}