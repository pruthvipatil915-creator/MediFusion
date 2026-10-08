package com.medai.backend.dto;

public class HospitalResponseDTO {

    private Long id;
    private String hospitalName;
    private String city;
    private String address;
    private String phone;
    private String email;
    private String specialization;

    public HospitalResponseDTO() {
    }

    public HospitalResponseDTO(Long id, String hospitalName, String city,
                               String address, String phone,
                               String email, String specialization) {
        this.id = id;
        this.hospitalName = hospitalName;
        this.city = city;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.specialization = specialization;
    }

    public Long getId() {
        return id;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public String getCity() {
        return city;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}