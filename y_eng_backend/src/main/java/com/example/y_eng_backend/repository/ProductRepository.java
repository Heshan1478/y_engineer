package com.example.y_eng_backend.repository;

import com.example.y_eng_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by category
    List<Product> findByCategoryId(Long categoryId);

    // Search products by name (case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products with stock greater than 0
    List<Product> findByStockQtyGreaterThan(Integer qty);
}