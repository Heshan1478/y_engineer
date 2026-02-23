// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ 401 Unauthorized - redirecting to login');
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH API ───────────────────────────────────────────────
export const authAPI = {
  login: (userId, email, role) => 
    axios.post(`${API_BASE_URL}/auth/login`, { userId, email, role }),
  
  verifyToken: (token) => 
    axios.post(`${API_BASE_URL}/auth/verify`, { token }),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
};

// ─── PRODUCT API ────────────────────────────────────────────
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getInStock: () => api.get('/products/in-stock'),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

// ─── CATEGORY API ───────────────────────────────────────────
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ─── CART API ───────────────────────────────────────────────
export const cartAPI = {
  getByUser: (userId) => api.get(`/cart/user/${userId}`),
  addItem: (userId, productId, quantity) => 
    api.post('/cart', { userId, productId, quantity }),
  updateItem: (cartItemId, quantity) => 
    api.put(`/cart/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/${cartItemId}`),
  clearCart: (userId) => api.delete(`/cart/user/${userId}`),
};

// ─── ORDER API ──────────────────────────────────────────────
export const orderAPI = {
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders'),
  create: (order) => api.post('/orders', order),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// ─── REPAIR API ─────────────────────────────────────────────
export const repairAPI = {
  getByUser: (userId) => api.get(`/repair-requests/user/${userId}`),
  getAll: () => api.get('/repair-requests'),
  getById: (id) => api.get(`/repair-requests/${id}`),
  create: (repairRequest) => api.post('/repair-requests', repairRequest),
  updateStatus: (id, status, adminNotes) => 
    api.patch(`/repair-requests/${id}/status`, { status, adminNotes }),
};

export default api;