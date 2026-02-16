// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Layout
import Navbar from './components/Navbar';

// Public Pages
import Home      from './pages/Home';
import Products  from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services  from './pages/Services';
import About     from './pages/About';
import Contact   from './pages/Contact';
import BookRepair from './pages/BookRepair';

// Cart & Orders
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';

// Auth Pages
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import ResetPassword from './pages/ResetPassword';

// Private Pages
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        backgroundColor: '#1a1a2e',
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
          <h2 style={{ color: '#E65C00', fontWeight: '800' }}>Yashoda Engineers</h2>
          <p style={{ color: '#aab' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* Navbar visible on all pages */}
      <Navbar user={user} />

      <Routes>
        {/* ── PUBLIC ROUTES (No login needed) ──────────── */}
        <Route path="/"              element={<Home />} />
        <Route path="/products"      element={<Products />} />
        <Route path="/products/:id"  element={<ProductDetail user={user} />} />
        <Route path="/services"      element={<Services user={user} />} />
        <Route path="/about"         element={<About />} />
        <Route path="/contact"       element={<Contact />} />

        {/* ── AUTH ROUTES (Redirect to /products if already logged in) ── */}
        <Route path="/login"          element={user ? <Navigate to="/products" /> : <Login />} />
        <Route path="/signup"         element={user ? <Navigate to="/products" /> : <Signup />} />
        <Route path="/reset-password" element={user ? <Navigate to="/products" /> : <ResetPassword />} />

        {/* ── PRIVATE ROUTES (Login required) ──────────── */}
        <Route path="/book-repair" element={user ? <BookRepair /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/order-confirmation" element={user ? <OrderConfirmation /> : <Navigate to="/login" />} />
        <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />

        {/* ── CATCH ALL ────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;