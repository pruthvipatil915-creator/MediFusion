package com.medai.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medai.backend.dto.DashboardResponse;
import com.medai.backend.service.DashboardService;

@RestController
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/api/dashboard")
    public DashboardResponse getDashboard(Authentication authentication) {

        return dashboardService.getDashboard(authentication.getName());
    }
}