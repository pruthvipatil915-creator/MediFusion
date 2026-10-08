package com.medai.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.medai.backend.dto.ChatRequest;
import com.medai.backend.dto.ChatResponse;
import com.medai.backend.service.GeminiService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String reply = geminiService.getGeminiResponse(request.getMessage());

        return new ChatResponse(reply);
    }
}