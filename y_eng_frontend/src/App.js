// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
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

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
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
          </div>

          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            {user ? (
              <>
                <span>Welcome, {user.email}</span>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                  Dashboard
                </Link>
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
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                  Login
                </Link>
                <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>
                  Signup
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={
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
          } />
          
          {/* Public Routes - Anyone can access */}
          <Route path="/products" element={<Products />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes - Need login */}
          <Route path="/dashboard" element={
            user ? <Dashboard /> : <Login />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;