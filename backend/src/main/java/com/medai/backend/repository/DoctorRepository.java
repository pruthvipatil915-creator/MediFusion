package com.medai.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medai.backend.entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // Find doctors by specialization
    List<Doctor> findBySpecialization(String specialization);

    // Find doctors by city
    List<Doctor> findByCity(String city);

    // Find doctors by specialization and city
    List<Doctor> findBySpecializationAndCity(String specialization, String city);

}