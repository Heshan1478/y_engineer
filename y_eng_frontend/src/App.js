// src/App.js
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';   // ← NEW

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div>
        {/* Navbar — only when logged in */}
        {user && (
          <nav style={{
            padding: '15px 30px',
            backgroundColor: '#2c3e50',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <Link to="/" style={navLink}>Y Engineering</Link>
              <Link to="/products" style={navLink}>Products</Link>
              <Link to="/dashboard" style={navLink}>Dashboard</Link>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ color: '#ccc', fontSize: 14 }}>{user.email}</span>
              <button onClick={handleLogout} style={logoutBtn}>Logout</button>
            </div>
          </nav>
        )}

        {/* Routes */}
        <Routes>
          {/* Public routes */}
          <Route path="/login"         element={user ? <Navigate to="/products" /> : <Login />} />
          <Route path="/signup"        element={user ? <Navigate to="/products" /> : <Signup />} />
          <Route path="/reset-password" element={user ? <Navigate to="/products" /> : <ResetPassword />} />

          {/* Protected routes */}
          <Route path="/" element={
            user
              ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <h1>Welcome to Y Engineering</h1>
                  <p style={{ color: '#666' }}>Your one-stop shop for electrical equipment and repairs</p>
                  <Link to="/products">
                    <button style={primaryBtn}>Browse Products</button>
                  </Link>
                </div>
              )
              : <Navigate to="/login" />
          } />

          <Route path="/products"       element={user ? <Products />       : <Navigate to="/login" />} />
          <Route path="/products/:id"   element={user ? <ProductDetail />  : <Navigate to="/login" />} />  {/* ← NEW */}
          <Route path="/dashboard"      element={user ? <Dashboard />      : <Navigate to="/login" />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

// ── Inline styles ───────────────────────────────────────────
const navLink = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: 15,
};

const logoutBtn = {
  padding: '8px 16px',
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: '600',
};

const primaryBtn = {
  marginTop: 20,
  padding: '14px 28px',
  fontSize: 16,
  backgroundColor: '#e65c00',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: '700',
};

export default App;