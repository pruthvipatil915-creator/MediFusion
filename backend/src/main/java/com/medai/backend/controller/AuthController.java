package com.medai.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.medai.backend.dto.AuthResponse;
import com.medai.backend.dto.LoginRequest;
import com.medai.backend.dto.RegisterRequest;
import com.medai.backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register User
    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        return authService.registerUser(request);
    }

    // Login User
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.loginUser(request);
    }
}