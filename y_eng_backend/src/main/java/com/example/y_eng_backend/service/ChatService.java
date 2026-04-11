package com.example.y_eng_backend.service;

import com.example.y_eng_backend.entity.Category;
import com.example.y_eng_backend.entity.Product;
import com.example.y_eng_backend.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmbeddingService embeddingService;

    @Autowired
    private DataSource dataSource;

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    // ─── MAIN METHOD ─────────────────────────────────────────────
    public Map<String, Object> processQuery(String userMessage, List<Map<String, String>> history) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🔍 Processing query: " + userMessage);

            // Step 1: Generate embedding for user query
            float[] queryEmbedding = embeddingService.generateEmbedding(userMessage);

            List<Product> relevantProducts;

            if (queryEmbedding != null) {
                // Step 2a: Vector search — find top 5 similar products
                System.out.println("🧠 Using vector search...");
                relevantProducts = vectorSearch(queryEmbedding, 5);
                System.out.println("✅ Vector search found: " + relevantProducts.size() + " products");
            } else {
                // Step 2b: Fallback to all products if embedding fails
                System.out.println("⚠️ Embedding failed, using all products...");
                relevantProducts = getProducts();
            }

            // Step 3: Build context from relevant products only
            String productContext = buildProductContext(relevantProducts);

            // Step 4: Ask Gemini with only relevant products
            String geminiReply = askGemini(userMessage, history, productContext);

            // Step 5: Extract mentioned product IDs
            List<Product> matchedProducts = extractMentionedProducts(
                    geminiReply, relevantProducts
            );

            // Clean reply before sending to frontend
            String cleanReply = geminiReply
                    .replaceAll("PRODUCT_IDS:[\\d,\\s]*", "")
                    .trim();

            response.put("message", cleanReply);
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

    // ─── VECTOR SEARCH ───────────────────────────────────────────
    private List<Product> vectorSearch(float[] queryEmbedding, int limit) throws Exception {
        String vectorString = embeddingService.toVectorString(queryEmbedding);
        List<Product> results = new ArrayList<>();

        String sql = "SELECT p.id, p.name, p.description, p.price, p.stock_qty, " +
                "p.category_id, p.image_url " +
                "FROM public.products p " +
                "WHERE p.embedding IS NOT NULL " +
                "ORDER BY p.embedding <=> ?::vector " +
                "LIMIT ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, vectorString);
            stmt.setInt(2, limit);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Product p = new Product();
                p.setId(rs.getLong("id"));
                p.setName(rs.getString("name"));
                p.setDescription(rs.getString("description"));
                p.setPrice(rs.getBigDecimal("price"));
                p.setStockQty(rs.getInt("stock_qty"));
                p.setCategoryId(rs.getLong("category_id"));
                p.setImageUrl(rs.getString("image_url"));
                results.add(p);
            }
        }

        return results;
    }

    // ─── GET ALL PRODUCTS (fallback) ─────────────────────────────
    @Transactional(readOnly = true)
    private List<Product> getProducts() {
        return productRepository.findAll();
    }

    // ─── BUILD PRODUCT CONTEXT ───────────────────────────────────
    private String buildProductContext(List<Product> products) {
        if (products.isEmpty()) {
            return "No products currently available.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Relevant products for this query:\n\n");

        for (Product p : products) {
            sb.append("ID:").append(p.getId())
                    .append(" | Name: ").append(p.getName())
                    .append(" | Price: Rs.").append(p.getPrice())
                    .append(" | Stock: ").append(p.getStockQty() > 0 ?
                            "In Stock (" + p.getStockQty() + ")" : "Out of Stock")
                    .append(" | Description: ").append(
                            p.getDescription() != null ? p.getDescription() : "")
                    .append("\n");
        }

        return sb.toString();
    }

    // ─── CALL GEMINI ─────────────────────────────────────────────
    private String askGemini(String userMessage,
                             List<Map<String, String>> history,
                             String productContext) throws Exception {

        String systemPrompt = "You are a helpful product assistant for Yashoda Engineers, " +
                "a shop that sells water motors, electric spray guns, chain saws, compressors, " +
                "repair parts, hammers, and grinders. " +
                "Recommend specific products from the list below. " +
                "Always mention product name and price. Be friendly and helpful. " +
                "If asked about repair services, mention the 'Book Repair' option on the website. " +
                "Keep answers short and clear (2-4 sentences). " +
                "At the end, if recommending products write PRODUCT_IDS: followed by " +
                "comma-separated IDs like: PRODUCT_IDS:1,3,5\n\n" +
                productContext;

        List<Map<String, Object>> contents = new ArrayList<>();

        if (history != null) {
            for (Map<String, String> msg : history) {
                Map<String, Object> content = new HashMap<>();
                content.put("role", msg.get("role").equals("user") ? "user" : "model");
                content.put("parts", List.of(Map.of("text", msg.get("text"))));
                contents.add(content);
            }
        }

        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", List.of(Map.of("text", userMessage)));
        contents.add(userContent);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("system_instruction",
                Map.of("parts", List.of(Map.of("text", systemPrompt))));
        requestBody.put("contents", contents);

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/" +
                "gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> httpResponse = httpClient.send(
                request, HttpResponse.BodyHandlers.ofString()
        );

        System.out.println("🤖 Gemini status: " + httpResponse.statusCode());

        if (httpResponse.statusCode() != 200) {
            System.err.println("Gemini error: " + httpResponse.body());
            return "Sorry, I could not process your request right now. Please try again.";
        }

        JsonNode root = objectMapper.readTree(httpResponse.body());
        return root.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();
    }

    // ─── EXTRACT PRODUCT IDs ─────────────────────────────────────
    private List<Product> extractMentionedProducts(String reply,
                                                   List<Product> products) {
        try {
            if (reply.contains("PRODUCT_IDS:")) {
                String idsPart = reply.split("PRODUCT_IDS:")[1].trim();
                idsPart = idsPart.split("\n")[0].trim();

                Set<Long> ids = Arrays.stream(idsPart.split(","))
                        .map(String::trim)
                        .filter(s -> s.matches("\\d+"))
                        .map(Long::parseLong)
                        .collect(Collectors.toSet());

                return products.stream()
                        .filter(p -> ids.contains(p.getId()))
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            System.err.println("Could not extract product IDs: " + e.getMessage());
        }
        return new ArrayList<>();
    }
}