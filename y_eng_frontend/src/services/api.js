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
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getInStock: () => api.get('/products/in-stock'),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// ============ CATEGORY APIs ============

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ============ REPAIR REQUEST APIs ============

export const repairAPI = {
  create: (repairData) => api.post('/repairs', repairData),
  getByUser: (userId) => api.get(`/repairs/user/${userId}`),
  getById: (id) => api.get(`/repairs/${id}`),
  getAll: () => api.get('/repairs'),
  getByStatus: (status) => api.get(`/repairs/status/${status}`),
  updateStatus: (id, status, adminNotes) => 
    api.patch(`/repairs/${id}/status`, { status, adminNotes }),
  update: (id, repairData) => api.put(`/repairs/${id}`, repairData),
  delete: (id) => api.delete(`/repairs/${id}`),
};

// ============ CART APIs ============

export const cartAPI = {
  // Get user's cart
  getByUser: (userId) => api.get(`/cart/user/${userId}`),
  
  // Add item to cart
  addItem: (userId, productId, quantity) => 
    api.post('/cart', { userId, productId, quantity }),
  
  // Update cart item quantity
  updateItem: (cartItemId, quantity) => 
    api.put(`/cart/${cartItemId}`, { quantity }),
  
  // Remove item from cart
  removeItem: (cartItemId) => api.delete(`/cart/${cartItemId}`),
  
  // Clear entire cart
  clearCart: (userId) => api.delete(`/cart/user/${userId}`),
};

// ============ ORDER APIs ============

export const orderAPI = {
  // Get user's orders
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  
  // Get order by ID
  getById: (id) => api.get(`/orders/${id}`),
  
  // Get all orders (admin)
  getAll: () => api.get('/orders'),
  
  // Create new order
  create: (orderData) => api.post('/orders', orderData),
  
  // Update order status (admin)
  updateStatus: (id, status) => 
    api.patch(`/orders/${id}/status`, { status }),
};

export default api;