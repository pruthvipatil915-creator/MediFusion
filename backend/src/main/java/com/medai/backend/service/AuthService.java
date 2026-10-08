package com.medai.backend.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medai.backend.dto.RegisterRequest;
import com.medai.backend.entity.User;
import com.medai.backend.repository.UserRepository;
import com.medai.backend.dto.LoginRequest;
import com.medai.backend.dto.AuthResponse;
import com.medai.backend.exception.UnauthorizedException;
import com.medai.backend.jwt.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    public String registerUser(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists!";
        }

        // Create new user
        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default role
        user.setRole("USER");

        // Default values
        user.setGender("Male");
        user.setAddress("Not Provided");

        // Optional fields
        user.setPhone(null);
        user.setAge(null);

        // Registration date
        user.setCreatedAt(LocalDateTime.now());

        // Save user
        userRepository.save(user);

        return "User Registered Successfully!";
    }
    public AuthResponse loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
        	throw new UnauthorizedException("User not found!");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        	throw new UnauthorizedException("Invalid Password!");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
        	    token,
        	    "Login Successful!",
        	    user.getId(),
        	    user.getFullName()
        	);

    }
}