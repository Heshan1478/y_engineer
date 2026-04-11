package com.example.y_eng_backend.controller;

import com.example.y_eng_backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.y_eng_backend.service.ProductEmbeddingService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class ChatController {

    @Autowired
    private ChatService chatService;
    @Autowired
    private ProductEmbeddingService productEmbeddingService;

    @PostMapping("/query")
    public ResponseEntity<?> handleQuery(@RequestBody Map<String, Object> request) {
        try {
            String userMessage = (String) request.get("message");

            // Get conversation history from frontend
            List<Map<String, String>> history = (List<Map<String, String>>) request.getOrDefault("history", List.of());

            System.out.println("💬 Chat query: " + userMessage);

            Map<String, Object> response = chatService.processQuery(userMessage, history);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Chat error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Sorry, I encountered an error.",
                    "products", List.of(),
                    "count", 0
            ));
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<?> getSuggestions() {
        return ResponseEntity.ok(Map.of("suggestions", List.of(
                "Show me water pumps under Rs. 6000",
                "What's the best motor for home use?",
                "Compare your compressors",
                "Which chainsaw do you recommend?",
                "Show products under Rs. 10000"
        )));
    }

    // Admin endpoint to generate embeddings for all products
    @PostMapping("/generate-embeddings")
    public ResponseEntity<?> generateEmbeddings() {
        try {
            System.out.println("🚀 Starting embedding generation...");
            String result = productEmbeddingService.generateAllEmbeddings();
            return ResponseEntity.ok(Map.of("result", result));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}