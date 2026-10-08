package com.medai.backend.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.medai.backend.jwt.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                // Disable CSRF
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> {
                })

                // Authorization
                .authorizeHttpRequests(auth -> auth

                        // Public APIs
                        .requestMatchers(
                                "/api/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()

                        // Chatbot API
                        .requestMatchers("/api/chat/**")
                        .permitAll()

                        // AI Prediction
                        .requestMatchers("/api/ai/**")
                        .hasAnyRole("USER", "ADMIN")

                        // Disease APIs
                        .requestMatchers(HttpMethod.GET, "/api/diseases/**").hasAnyRole("USER", "DOCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/diseases/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/diseases/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/diseases/**").hasRole("ADMIN")

                        // Doctor Management APIs
                        .requestMatchers(HttpMethod.GET, "/api/doctors/**").hasAnyRole("USER", "DOCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/doctors/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/doctors/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/doctors/**").hasRole("ADMIN")

                        // Hospital Management APIs
                        .requestMatchers(HttpMethod.GET, "/api/hospitals/**").hasAnyRole("USER", "DOCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/hospitals/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/hospitals/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/hospitals/**").hasRole("ADMIN")

                        // Admin User Management API
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // All remaining APIs
                        .anyRequest()
                        .authenticated())

                // Stateless Session
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authentication Provider
                .authenticationProvider(authenticationProvider)

                // JWT Filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)

                // Disable default login page
                .formLogin(form -> form.disable())

                .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173"));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}