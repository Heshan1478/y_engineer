package com.example.y_eng_backend.security;

import com.example.y_eng_backend.security.jwt.JwtResponse;
import com.example.y_eng_backend.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    // Login endpoint - receives Supabase user data and returns JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String userId = loginRequest.get("userId");
            String email = loginRequest.get("email");
            String role = loginRequest.get("role");

            // Validate required fields
            if (userId == null || email == null || role == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(userId, email, role);

            // Return JWT response
            JwtResponse jwtResponse = new JwtResponse(token, userId, email, role);
            return ResponseEntity.ok(jwtResponse);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating token: " + e.getMessage());
        }
    }

    // Verify token endpoint - checks if JWT is valid
    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");

            if (token == null) {
                return ResponseEntity.badRequest().body("Token is required");
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
            return ResponseEntity.ok(Map.of("valid", false, "error", e.getMessage()));
        }
    }

    // Get current user info from token
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("No token provided");
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
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}