package com.example.y_eng_backend.security;

import com.example.y_eng_backend.security.jwt.JwtResponse;
import com.example.y_eng_backend.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String userId = loginRequest.get("userId");
            String email = loginRequest.get("email");
            String role = loginRequest.get("role");

            System.out.println("----------------");
            System.out.println(" Login request received:");
            System.out.println("   User ID: " + userId);
            System.out.println("   Email: " + email);
            System.out.println("   Role: " + role);

            if (userId == null || email == null || role == null) {
                System.err.println(" Missing required fields");
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Missing required fields"
                ));
            }

            String token = jwtUtil.generateToken(userId, email, role);
            System.out.println("JWT token generated successfully");
            System.out.println("   Token preview: " + token.substring(0, Math.min(50, token.length())) + "...");
            System.out.println("--------------");

            JwtResponse jwtResponse = new JwtResponse(token, userId, email, role);
            return ResponseEntity.ok(jwtResponse);

        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error generating token",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");

            if (token == null) {
                return ResponseEntity.badRequest().body(Map.of("valid", false));
            }

            boolean isValid = jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token);

            if (isValid) {
                String userId = jwtUtil.getUserIdFromToken(token);
                String email = jwtUtil.getEmailFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);

                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "userId", userId,
                        "email", email,
                        "role", role
                ));
            } else {
                return ResponseEntity.ok(Map.of("valid", false));
            }

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "No token provided"));
            }

            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
                String userId = jwtUtil.getUserIdFromToken(token);
                String email = jwtUtil.getEmailFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);

                return ResponseEntity.ok(Map.of(
                        "userId", userId,
                        "email", email,
                        "role", role
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}