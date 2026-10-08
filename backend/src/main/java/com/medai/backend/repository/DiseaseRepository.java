package com.medai.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medai.backend.entity.Disease;
import java.util.List;
public interface DiseaseRepository extends JpaRepository<Disease, Long> {
	List<Disease> findAll();

    @Query("""
        SELECT d
        FROM Disease d
        WHERE LOWER(TRIM(d.diseaseName))
        = LOWER(TRIM(:diseaseName))
    """)
    Optional<Disease> findByDiseaseName(
            @Param("diseaseName") String diseaseName);

}