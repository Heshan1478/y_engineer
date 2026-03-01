package com.example.y_eng_backend.controller;

import com.example.y_eng_backend.entity.Product;
import com.example.y_eng_backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/query")
    public ResponseEntity<?> handleQuery(@RequestBody Map<String, String> request) {
        try {
            String userQuery = request.get("message");

            System.out.println("💬 Chat query received: " + userQuery);

            // Parse query and search products
            Map<String, Object> response = chatService.processQuery(userQuery);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Chat error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Sorry, I encountered an error. Please try again.");
            errorResponse.put("products", List.of());

            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<?> getSuggestions() {
        List<String> suggestions = List.of(
                "Show me water pumps under Rs. 6000",
                "I need a motor for home use",
                "What chain saws do you have?",
                "Show all products in stock",
                "Pumps with 1HP power"
        );

        return ResponseEntity.ok(Map.of("suggestions", suggestions));
    }
}