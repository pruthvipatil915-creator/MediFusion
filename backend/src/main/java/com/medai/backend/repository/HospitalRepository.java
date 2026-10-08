package com.medai.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medai.backend.entity.Hospital;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findByCity(String city);

    List<Hospital> findBySpecialization(String specialization);

    List<Hospital> findByCityAndSpecialization(String city, String specialization);

}