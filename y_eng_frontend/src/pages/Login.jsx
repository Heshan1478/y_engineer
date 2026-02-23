// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Login with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const user = authData.user;

      // Step 2: Get user's role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const role = profile?.role || 'customer';

      // Step 3: Get JWT token from backend
      const jwtResponse = await authAPI.login(user.id, user.email, role);
      const { token } = jwtResponse.data;

      // Step 4: Store JWT token in localStorage
      localStorage.setItem('jwtToken', token);

      console.log('✅ Login successful! JWT token stored.');
      console.log('👤 User:', user.email);
      console.log('🔑 Role:', role);

     // Step 5: Navigate based on role
        console.log('🚀 Navigating to:', role === 'admin' ? '/admin' : '/dashboard');

        if (role === 'admin') {
          window.location.href = '/admin';  // Force full page reload
      } else {
          window.location.href = '/dashboard';
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to your account</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account?{' '}
              <Link to="/signup" style={styles.link}>
                Sign up here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f8f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: 420,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    margin: 0,
  },
  errorBox: {
    backgroundColor: '#fce4ec',
    color: '#c62828',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  input: {
    padding: 12,
    fontSize: 15,
    border: '2px solid #e0e0e0',
    borderRadius: 8,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    backgroundColor: '#E65C00',
    color: 'white',
    padding: 14,
    fontSize: 16,
    fontWeight: '700',
    border: 'none',
    borderRadius: 8,
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    margin: 0,
  },
  link: {
    color: '#E65C00',
    textDecoration: 'none',
    fontWeight: '600',
  },
};