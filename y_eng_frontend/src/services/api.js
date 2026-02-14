// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ PRODUCT APIs ============

export const productAPI = {
  // Get all products
  getAll: () => api.get('/products'),

  // Get product by ID
  getById: (id) => api.get(`/products/${id}`),

  // Get products by category
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),

  // Search products
  search: (query) => api.get(`/products/search?q=${query}`),

  // Get in-stock products
  getInStock: () => api.get('/products/in-stock'),

  // Create product (admin)
  create: (productData) => api.post('/products', productData),

  // Update product (admin)
  update: (id, productData) => api.put(`/products/${id}`, productData),

  // Delete product (admin)
  delete: (id) => api.delete(`/products/${id}`),
};

// ============ CATEGORY APIs ============

export const categoryAPI = {
  // Get all categories
  getAll: () => api.get('/categories'),

  // Get category by ID
  getById: (id) => api.get(`/categories/${id}`),

  // Create category (admin)
  create: (categoryData) => api.post('/categories', categoryData),

  // Update category (admin)
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),

  // Delete category (admin)
  delete: (id) => api.delete(`/categories/${id}`),
};

// ============ REPAIR REQUEST APIs ============

export const repairAPI = {
  // Create new repair request
  create: (repairData) => api.post('/repairs', repairData),

  // Get all repairs for a user
  getByUser: (userId) => api.get(`/repairs/user/${userId}`),

  // Get repair by ID
  getById: (id) => api.get(`/repairs/${id}`),

  // Get all repairs (admin)
  getAll: () => api.get('/repairs'),

  // Get repairs by status
  getByStatus: (status) => api.get(`/repairs/status/${status}`),

  // Update repair status (admin)
  updateStatus: (id, status, adminNotes) => 
    api.patch(`/repairs/${id}/status`, { status, adminNotes }),

  // Update repair request
  update: (id, repairData) => api.put(`/repairs/${id}`, repairData),

  // Delete repair request
  delete: (id) => api.delete(`/repairs/${id}`),
};

export default api;