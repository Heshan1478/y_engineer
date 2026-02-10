// src/App.js
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div>
        {/* Navigation Bar - Only show if user is logged in */}
        {user && (
          <nav style={{
            padding: '15px 30px',
            backgroundColor: '#2c3e50',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                Y Engineering
              </Link>
              <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>
                Products
              </Link>
              <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                Dashboard
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
              <span>Welcome, {user.email}</span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </nav>
        )}

        {/* Routes */}
        <Routes>
          {/* Public Routes - Only accessible when NOT logged in */}
          <Route path="/login" element={
            user ? <Navigate to="/products" /> : <Login />
          } />
          
          <Route path="/signup" element={
            user ? <Navigate to="/products" /> : <Signup />
          } />
          
          <Route path="/reset-password" element={
            user ? <Navigate to="/products" /> : <ResetPassword />
          } />

          {/* Protected Routes - Only accessible when logged in */}
          <Route path="/" element={
            user ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <h1>Welcome to Y Engineering</h1>
                <p>Your one-stop shop for electrical equipment and repairs</p>
                <Link to="/products">
                  <button style={{
                    padding: '12px 24px',
                    fontSize: 16,
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: 5,
                    cursor: 'pointer',
                    marginTop: 20
                  }}>
                    Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/products" element={
            user ? <Products /> : <Navigate to="/login" />
          } />
          
          <Route path="/dashboard" element={
            user ? <Dashboard /> : <Navigate to="/login" />
          } />

          {/* Catch all - redirect to login or home based on auth */}
          <Route path="*" element={
            <Navigate to={user ? "/" : "/login"} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;