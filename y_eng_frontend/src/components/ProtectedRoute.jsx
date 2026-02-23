// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.verifyToken(token);
      const { valid, role } = response.data;
      
      setIsValid(valid);
      setIsAdmin(role === 'admin');
    } catch (err) {
      console.error('Auth check failed:', err);
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h3>Verifying...</h3>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}