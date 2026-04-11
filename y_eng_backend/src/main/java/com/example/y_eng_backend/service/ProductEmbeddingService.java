package com.example.y_eng_backend.service;

import com.example.y_eng_backend.entity.Product;
import com.example.y_eng_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
public class ProductEmbeddingService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmbeddingService embeddingService;

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    // Generate and save embeddings for ALL products
    public String generateAllEmbeddings() {
        List<Product> products = productRepository.findAll();
        int success = 0;
        int failed = 0;

        System.out.println("🚀 Generating embeddings for " + products.size() + " products...");

        for (Product product : products) {
            try {
                // Build text to embed
                String textToEmbed = buildProductText(product);
                System.out.println("📝 Embedding: " + product.getName());

                // Generate embedding
                float[] embedding = embeddingService.generateEmbedding(textToEmbed);

                if (embedding != null) {
                    // Save to database using raw SQL via JDBC
                    saveEmbedding(product.getId(), embedding);
                    success++;
                    System.out.println("✅ Saved embedding for: " + product.getName());
                } else {
                    failed++;
                }

                // Small delay to avoid rate limiting
                Thread.sleep(500);

            } catch (Exception e) {
                System.err.println("❌ Failed for " + product.getName() + ": " + e.getMessage());
                failed++;
            }
        }

        return "Done! Success: " + success + ", Failed: " + failed;
    }

    // Build searchable text for a product
    private String buildProductText(Product product) {
        StringBuilder sb = new StringBuilder();
        sb.append(product.getName()).append(". ");

        if (product.getDescription() != null) {
            sb.append(product.getDescription()).append(". ");
        }

        if (product.getCategory() != null) {
            sb.append("Category: ").append(product.getCategory().getName()).append(". ");
        }

        sb.append("Price: Rs.").append(product.getPrice()).append(". ");
        sb.append(product.getStockQty() > 0 ? "In stock." : "Out of stock.");

        return sb.toString();
    }

    // Save embedding to Supabase using JDBC template
    private void saveEmbedding(Long productId, float[] embedding) throws Exception {
        String vectorString = embeddingService.toVectorString(embedding);

        String url = "https://generativelanguage.googleapis.com"; // placeholder

        // Use direct JDBC to update the vector column
        javax.sql.DataSource dataSource = getDataSource();
        try (java.sql.Connection conn = dataSource.getConnection();
             java.sql.PreparedStatement stmt = conn.prepareStatement(
                     "UPDATE public.products SET embedding = ?::vector WHERE id = ?"
             )) {
            stmt.setString(1, vectorString);
            stmt.setLong(2, productId);
            stmt.executeUpdate();
        }
    }

    @Autowired
    private javax.sql.DataSource dataSource;

    private javax.sql.DataSource getDataSource() {
        return dataSource;
    }
}