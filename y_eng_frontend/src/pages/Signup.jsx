// src/pages/Signup.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setMsg("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMsg(error.message);
      setLoading(false);
    } else {
      setMsg("Signup success! You can now login.");
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        maxWidth: 400, 
        width: '100%',
        padding: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: 10 }}>Y Engineering</h1>
        <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 20, color: '#666' }}>
          Create Your Account
        </h2>
        
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              Email
            </label>
            <input
              type="email"
              required
              style={{ 
                width: '100%', 
                padding: 12, 
                fontSize: 16,
                border: '1px solid #ddd',
                borderRadius: 5,
                boxSizing: 'border-box'
              }}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              Password
            </label>
            <input
              type="password"
              required
              style={{ 
                width: '100%', 
                padding: 12, 
                fontSize: 16,
                border: '1px solid #ddd',
                borderRadius: 5,
                boxSizing: 'border-box'
              }}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              style={{ 
                width: '100%', 
                padding: 12, 
                fontSize: 16,
                border: '1px solid #ddd',
                borderRadius: 5,
                boxSizing: 'border-box'
              }}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: 12,
              fontSize: 16,
              backgroundColor: loading ? '#ccc' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {msg && (
          <div style={{ 
            marginTop: 20, 
            padding: 12, 
            backgroundColor: msg.includes('success') ? '#d4edda' : '#f8d7da',
            color: msg.includes('success') ? '#155724' : '#721c24',
            borderRadius: 5,
            textAlign: 'center'
          }}>
            {msg}
          </div>
        )}

        <div style={{ 
          marginTop: 20, 
          paddingTop: 20, 
          borderTop: '1px solid #eee',
          textAlign: 'center' 
        }}>
          <p style={{ margin: 0, color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
