package com.example.y_eng_backend.service;

import com.example.y_eng_backend.entity.Product;
import com.example.y_eng_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ProductRepository productRepository;

    public Map<String, Object> processQuery(String query) {
        Map<String, Object> response = new HashMap<>();

        // Parse user query
        QueryIntent intent = parseQuery(query.toLowerCase());

        System.out.println("🔍 Parsed intent:");
        System.out.println("   Keywords: " + intent.keywords);
        System.out.println("   Max Price: " + intent.maxPrice);
        System.out.println("   Min Price: " + intent.minPrice);
        System.out.println("   Category: " + intent.category);

        // Search products
        List<Product> products = searchProducts(intent);

        System.out.println("✅ Found " + products.size() + " products");

        // Generate response message
        String message = generateResponse(intent, products);

        response.put("message", message);
        response.put("products", products);
        response.put("count", products.size());

        return response;
    }

    private QueryIntent parseQuery(String query) {
        QueryIntent intent = new QueryIntent();

        // Extract price range
        intent.maxPrice = extractMaxPrice(query);
        intent.minPrice = extractMinPrice(query);

        // Extract category keywords
        intent.category = extractCategory(query);

        // Extract general keywords
        intent.keywords = extractKeywords(query);

        return intent;
    }

    private BigDecimal extractMaxPrice(String query) {
        // Patterns: "under 6000", "below 5000", "less than 7000", "< 6000"
        Pattern pattern = Pattern.compile("(?:under|below|less than|<|max|maximum)\\s*(?:rs\\.?\\s*)?([0-9,]+)");
        Matcher matcher = pattern.matcher(query);

        if (matcher.find()) {
            String priceStr = matcher.group(1).replace(",", "");
            return new BigDecimal(priceStr);
        }

        // Pattern: "6000 or less", "5000 rupees max"
        pattern = Pattern.compile("([0-9,]+)\\s*(?:or less|max|maximum)");
        matcher = pattern.matcher(query);

        if (matcher.find()) {
            String priceStr = matcher.group(1).replace(",", "");
            return new BigDecimal(priceStr);
        }

        return null;
    }

    private BigDecimal extractMinPrice(String query) {
        // Patterns: "above 3000", "over 4000", "more than 2000", "> 5000"
        Pattern pattern = Pattern.compile("(?:above|over|more than|>|min|minimum)\\s*(?:rs\\.?\\s*)?([0-9,]+)");
        Matcher matcher = pattern.matcher(query);

        if (matcher.find()) {
            String priceStr = matcher.group(1).replace(",", "");
            return new BigDecimal(priceStr);
        }

        return null;
    }

    private String extractCategory(String query) {
        // Category keywords mapping
        Map<String, List<String>> categoryMap = new HashMap<>();
        categoryMap.put("water motors", Arrays.asList("water motor", "water pump", "pump", "motor"));
        categoryMap.put("chain saws", Arrays.asList("chain saw", "chainsaw", "saw"));
        categoryMap.put("tools", Arrays.asList("tool", "equipment"));
        categoryMap.put("pipes", Arrays.asList("pipe", "piping"));

        for (Map.Entry<String, List<String>> entry : categoryMap.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (query.contains(keyword)) {
                    return entry.getKey();
                }
            }
        }

        return null;
    }

    private List<String> extractKeywords(String query) {
        // Remove common words
        String[] stopWords = {"show", "me", "find", "get", "i", "need", "want", "looking", "for",
                "a", "an", "the", "in", "under", "above", "below", "rs", "rupees",
                "price", "budget", "around", "approximately"};

        String[] words = query.split("\\s+");
        List<String> keywords = new ArrayList<>();

        for (String word : words) {
            word = word.replaceAll("[^a-z0-9]", "");
            if (word.length() > 2 && !Arrays.asList(stopWords).contains(word)) {
                keywords.add(word);
            }
        }

        return keywords;
    }

    private List<Product> searchProducts(QueryIntent intent) {
        Pageable limit = PageRequest.of(0, 10); // Max 10 results

        // Build search query
        List<Product> allProducts = productRepository.findAll();

        return allProducts.stream()
                .filter(product -> matchesIntent(product, intent))
                .limit(10)
                .collect(Collectors.toList());
    }

    private boolean matchesIntent(Product product, QueryIntent intent) {
        // Check price range
        if (intent.maxPrice != null && product.getPrice().compareTo(intent.maxPrice) > 0) {
            return false;
        }

        if (intent.minPrice != null && product.getPrice().compareTo(intent.minPrice) < 0) {
            return false;
        }

        // Check category
        if (intent.category != null) {
            String categoryName = product.getCategory() != null ?
                    product.getCategory().getName().toLowerCase() : "";

            if (!categoryName.contains(intent.category.toLowerCase())) {
                return false;
            }
        }

        // Check keywords in name or description
        if (!intent.keywords.isEmpty()) {
            String searchText = (product.getName() + " " +
                    (product.getDescription() != null ? product.getDescription() : "")).toLowerCase();

            boolean matchesAny = intent.keywords.stream()
                    .anyMatch(keyword -> searchText.contains(keyword));

            if (!matchesAny) {
                return false;
            }
        }

        return true;
    }

    private String generateResponse(QueryIntent intent, List<Product> products) {
        if (products.isEmpty()) {
            return "I couldn't find any products matching your criteria. Try adjusting your budget or search terms.";
        }

        StringBuilder message = new StringBuilder();

        if (products.size() == 1) {
            message.append("I found 1 product that matches your search:");
        } else {
            message.append("I found ").append(products.size()).append(" products");

            if (intent.maxPrice != null) {
                message.append(" under Rs. ").append(intent.maxPrice.toPlainString());
            }

            if (intent.category != null) {
                message.append(" in ").append(intent.category);
            }

            message.append(":");
        }

        return message.toString();
    }

    // Inner class for query intent
    private static class QueryIntent {
        BigDecimal maxPrice;
        BigDecimal minPrice;
        String category;
        List<String> keywords = new ArrayList<>();
    }
}