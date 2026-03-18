package com.example.y_eng_backend.controller;

import com.example.y_eng_backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/query")
    public ResponseEntity<?> handleQuery(@RequestBody Map<String, String> request) {
        try {
            String userQuery = request.get("message");

            System.out.println("💬 Chat query received: " + userQuery);

            Map<String, Object> response = chatService.processQuery(userQuery);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error in chat query: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(500).body(Map.of(
                    "message", "Sorry, I encountered an error. Please try again.",
                    "products", List.of(),
                    "count", 0
            ));
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<?> getSuggestions() {
        try {
            List<String> suggestions = List.of(
                    "Show me water pumps under Rs. 6000",
                    "I need a motor for home use",
                    "What chain saws do you have?",
                    "Show all products in stock",
                    "Pumps with 1HP power"
            );

            return ResponseEntity.ok(Map.of("suggestions", suggestions));

        } catch (Exception e) {
            System.err.println("❌ Error getting suggestions: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("suggestions", List.of()));
        }
    }
}