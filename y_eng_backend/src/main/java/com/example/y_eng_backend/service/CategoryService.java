package com.example.y_eng_backend.service;

import com.example.y_eng_backend.entity.Category;
import com.example.y_eng_backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Get category by name
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    // Create new category
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Update category
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        category.setName(categoryDetails.getName());
        return categoryRepository.save(category);
    }

    // Delete category
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}