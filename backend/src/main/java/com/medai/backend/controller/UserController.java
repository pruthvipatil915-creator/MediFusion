package com.medai.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.medai.backend.dto.ChangePasswordRequest;
import com.medai.backend.dto.UpdateProfileRequest;
import com.medai.backend.dto.UserProfileResponse;
import com.medai.backend.service.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // Get Logged-in User Profile
    @GetMapping("/api/user/profile")
    public UserProfileResponse getProfile(Authentication authentication) {

        String email = authentication.getName();

        return userService.getUserProfile(email);
    }

    // Update Logged-in User Profile
    @PutMapping("/api/user/profile")
    public UserProfileResponse updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        String email = authentication.getName();

        return userService.updateProfile(email, request);
    }

    // Change Password
    @PutMapping("/api/user/change-password")
    public String changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        String email = authentication.getName();

        return userService.changePassword(email, request);
    }

    // Delete Account
    @DeleteMapping("/api/user/delete")
    public String deleteAccount(Authentication authentication) {

        String email = authentication.getName();

        return userService.deleteAccount(email);
    }

    // Get All Users (Admin)
    @GetMapping("/api/users")
    public java.util.List<UserProfileResponse> getAllUsers() {
        return userService.getAllUsers();
    }
}