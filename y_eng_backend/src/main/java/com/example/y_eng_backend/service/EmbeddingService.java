package com.example.y_eng_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    // Generate embedding for any text
    public float[] generateEmbedding(String text) throws Exception {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/" +
                "gemini-embedding-001:embedContent?key=" + geminiApiKey;

        Map<String, Object> requestBody = Map.of(
                "model", "models/gemini-embedding-001",
                "content", Map.of(
                        "parts", List.of(Map.of("text", text))
                )
        );

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = httpClient.send(
                request, HttpResponse.BodyHandlers.ofString()
        );

        System.out.println("📐 Embedding status: " + response.statusCode());

        if (response.statusCode() != 200) {
            System.err.println("Embedding error: " + response.body());
            return null;
        }

        JsonNode root = objectMapper.readTree(response.body());
        JsonNode valuesNode = root.path("embedding").path("values");

        float[] embedding = new float[valuesNode.size()];
        for (int i = 0; i < valuesNode.size(); i++) {
            embedding[i] = (float) valuesNode.get(i).asDouble();
        }

        System.out.println("✅ Embedding generated, size: " + embedding.length);
        return embedding;
    }

    // Convert float array to string for PostgreSQL vector format
    public String toVectorString(float[] embedding) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.length; i++) {
            sb.append(embedding[i]);
            if (i < embedding.length - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}