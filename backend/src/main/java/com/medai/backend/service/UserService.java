package com.medai.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.medai.backend.exception.*;
import com.medai.backend.dto.ChangePasswordRequest;
import com.medai.backend.dto.UpdateProfileRequest;
import com.medai.backend.dto.UserProfileResponse;
import com.medai.backend.entity.User;
import com.medai.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get Logged-in User Profile
    public UserProfileResponse getUserProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAge(),
                user.getGender(),
                user.getAddress());
    }

    // Update User Profile
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());

        userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAge(),
                user.getGender(),
                user.getAddress());
    }

    // Change Password
    public String changePassword(String email, ChangePasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        // Check current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
        	throw new UnauthorizedException("Current password is incorrect");
        }

        // Encrypt new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // Save updated password
        userRepository.save(user);

        return "Password changed successfully";
    }

    // Get All Users (Admin)
    public java.util.List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserProfileResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getPhone(),
                        user.getAge(),
                        user.getGender(),
                        user.getAddress()))
                .collect(java.util.stream.Collectors.toList());
    }

    // Delete Account
    public String deleteAccount(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        userRepository.delete(user);

        return "Account deleted successfully";
    }
}