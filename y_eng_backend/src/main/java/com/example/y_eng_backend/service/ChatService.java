package com.example.y_eng_backend.service;

import com.example.y_eng_backend.entity.Product;
import com.example.y_eng_backend.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ProductRepository productRepository;

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    // ─── MAIN METHOD ─────────────────────────────────────────────
    public Map<String, Object> processQuery(String userMessage, List<Map<String, String>> history) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Step 1: Get all products from DB
            List<Product> allProducts = getProducts();

            // Step 2: Build product list as text for Gemini
            String productContext = buildProductContext(allProducts);

            // Step 3: Ask Gemini
            String geminiReply = askGemini(userMessage, history, productContext);

            // Step 4: Extract product IDs Gemini mentioned
            List<Product> matchedProducts = extractMentionedProducts(geminiReply, allProducts);

            response.put("message", geminiReply);
            response.put("products", matchedProducts);
            response.put("count", matchedProducts.size());

        } catch (Exception e) {
            System.err.println("❌ ChatService error: " + e.getMessage());
            e.printStackTrace();
            response.put("message", "Sorry, I encountered an error. Please try again.");
            response.put("products", new ArrayList<>());
            response.put("count", 0);
        }

        return response;
    }

    // ─── GET PRODUCTS ─────────────────────────────────────────────
    @Transactional(readOnly = true)
    private List<Product> getProducts() {
        return productRepository.findAll();
    }

    // ─── BUILD PRODUCT LIST FOR GEMINI ───────────────────────────
    private String buildProductContext(List<Product> products) {
        StringBuilder sb = new StringBuilder();
        sb.append("Here are the available products in our store:\n\n");

        for (Product p : products) {
            sb.append("ID:").append(p.getId())
                    .append(" | Name: ").append(p.getName())
                    .append(" | Price: Rs.").append(p.getPrice())
                    .append(" | Category: ").append(p.getCategory() != null ? p.getCategory().getName() : "General")
                    .append(" | Stock: ").append(p.getStockQty() > 0 ? "In Stock (" + p.getStockQty() + ")" : "Out of Stock")
                    .append(" | Description: ").append(p.getDescription() != null ? p.getDescription() : "")
                    .append("\n");
        }

        return sb.toString();
    }

    // ─── CALL GEMINI API ─────────────────────────────────────────
    private String askGemini(String userMessage, List<Map<String, String>> history, String productContext) throws Exception {

        String systemPrompt = "You are a helpful product assistant for Yashoda Engineers, " +
                "a shop that sells water motors, electric spray guns, chain saws, compressors, " +
                "repair parts, hammers, and grinders. " +
                "When a customer asks about products, recommend specific products from the list below. " +
                "Always mention the product name and price. Be friendly and helpful. " +
                "If they ask about repair services, tell them to use the 'Book Repair' option on the website. " +
                "Keep answers short and clear (2-4 sentences max). " +
                "At the end of your reply, if you are recommending specific products, write PRODUCT_IDS: " +
                "followed by comma-separated IDs like: PRODUCT_IDS:1,3,5\n\n" +
                productContext;

        // Build conversation history for Gemini
        List<Map<String, Object>> contents = new ArrayList<>();

        // Add chat history
        if (history != null) {
            for (Map<String, String> msg : history) {
                Map<String, Object> content = new HashMap<>();
                content.put("role", msg.get("role").equals("user") ? "user" : "model");
                content.put("parts", List.of(Map.of("text", msg.get("text"))));
                contents.add(content);
            }
        }

        // Add current user message
        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", List.of(Map.of("text", userMessage)));
        contents.add(userContent);

        // Build full request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("system_instruction", Map.of("parts", List.of(Map.of("text", systemPrompt))));
        requestBody.put("contents", contents);

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> httpResponse = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("🤖 Gemini status: " + httpResponse.statusCode());

        if (httpResponse.statusCode() != 200) {
            System.err.println("Gemini error: " + httpResponse.body());
            return "Sorry, I couldn't process your request right now. Please try again.";
        }

        // Parse response
        JsonNode root = objectMapper.readTree(httpResponse.body());
        return root.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();
    }

    // ─── EXTRACT PRODUCT IDs FROM GEMINI REPLY ───────────────────
    private List<Product> extractMentionedProducts(String reply, List<Product> allProducts) {
        try {
            // Look for "PRODUCT_IDS:1,3,5" pattern
            if (reply.contains("PRODUCT_IDS:")) {
                String idsPart = reply.split("PRODUCT_IDS:")[1].trim();
                // Take only first line in case there's text after
                idsPart = idsPart.split("\n")[0].trim();

                Set<Long> ids = Arrays.stream(idsPart.split(","))
                        .map(String::trim)
                        .filter(s -> s.matches("\\d+"))
                        .map(Long::parseLong)
                        .collect(Collectors.toSet());

                return allProducts.stream()
                        .filter(p -> ids.contains(p.getId()))
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            System.err.println("Could not extract product IDs: " + e.getMessage());
        }
        return new ArrayList<>();
    }
}