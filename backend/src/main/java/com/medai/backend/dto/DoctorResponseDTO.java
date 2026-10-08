package com.medai.backend.dto;

public class DoctorResponseDTO {

    private Long id;
    private String fullName;
    private String specialization;
    private String hospitalName;
    private String city;
    private Integer experience;
    private String availableDays;
    private String availableTime;
    private Double consultationFee;
    private String phone;

    // Default Constructor
    public DoctorResponseDTO() {
    }

    // Parameterized Constructor
    public DoctorResponseDTO(Long id, String fullName, String specialization,
                             String hospitalName, String city,
                             Integer experience, String availableDays,
                             String availableTime, Double consultationFee,
                             String phone) {

        this.id = id;
        this.fullName = fullName;
        this.specialization = specialization;
        this.hospitalName = hospitalName;
        this.city = city;
        this.experience = experience;
        this.availableDays = availableDays;
        this.availableTime = availableTime;
        this.consultationFee = consultationFee;
        this.phone = phone;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(String availableDays) {
        this.availableDays = availableDays;
    }

    public String getAvailableTime() {
        return availableTime;
    }

    public void setAvailableTime(String availableTime) {
        this.availableTime = availableTime;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}