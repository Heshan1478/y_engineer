// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Add JWT to ALL requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 JWT attached to:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('⚠️ 401 Unauthorized');
        localStorage.removeItem('jwtToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        console.error('❌ 403 Forbidden');
        alert('Access denied');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (userId, email, role) => 
    axios.post(`${API_BASE_URL}/auth/login`, { userId, email, role }),
  
  verifyToken: (token) => 
    axios.post(`${API_BASE_URL}/auth/verify`, { token }),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

export const cartAPI = {
  getByUser: (userId) => api.get(`/cart/user/${userId}`),
  addItem: (userId, productId, quantity) => 
    api.post('/cart', { userId, productId, quantity }),
  updateItem: (cartItemId, quantity) => 
    api.put(`/cart/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/${cartItemId}`),
  clearCart: (userId) => api.delete(`/cart/user/${userId}`),
};

export const orderAPI = {
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  getAll: () => api.get('/orders'),
  create: (order) => api.post('/orders', order),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const repairAPI = {
  getByUser: (userId) => api.get(`/repair-requests/user/${userId}`),
  getAll: () => api.get('/repair-requests'),
  create: (repairRequest) => api.post('/repair-requests', repairRequest),
  updateStatus: (id, status, adminNotes) => 
    api.patch(`/repair-requests/${id}/status`, { status, adminNotes }),
};

export default api;