package com.medai.backend.dto;

public class UserProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String phone;
    private Integer age;
    private String gender;
    private String address;

    // Default Constructor
    public UserProfileResponse() {
    }

    // Parameterized Constructor
    public UserProfileResponse(Long id,
                               String fullName,
                               String email,
                               String role,
                               String phone,
                               Integer age,
                               String gender,
                               String address) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.age = age;
        this.gender = gender;
        this.address = address;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}