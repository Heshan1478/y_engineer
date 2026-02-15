// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {     //logout function
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;   //highlisht where i currently on

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span>Yashoda <span style={styles.logoAccent}>Engineers</span></span>
        </Link>

        {/* Nav Links */}
        <div style={styles.links}>
          {[
            { to: '/',         label: 'Home'     },
            { to: '/products', label: 'Products' },
            { to: '/services', label: 'Services' },
            { to: '/about',    label: 'About'    },
            { to: '/contact',  label: 'Contact'  },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                ...styles.link,
                color: isActive(to) ? '#E65C00' : '#ddd',
                borderBottom: isActive(to) ? '2px solid #E65C00' : '2px solid transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div style={styles.auth}>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.userEmail}>
                👤 {user.email.split('@')[0]}
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#1a1a2e',
    borderBottom: '3px solid #E65C00',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 20,
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    letterSpacing: '-0.5px',
  },
  logoIcon: {
    fontSize: 24,
  },
  logoAccent: {
    color: '#E65C00',
  },
  links: {
    display: 'flex',
    gap: 4,
  },
  link: {
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: '500',
    padding: '20px 14px',
    transition: 'color 0.2s',
    letterSpacing: '0.3px',
  },
  auth: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  userEmail: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: '500',
  },
  loginBtn: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: '600',
    padding: '8px 16px',
  },
  signupBtn: {
    backgroundColor: '#E65C00',
    color: 'white',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: '700',
    padding: '8px 18px',
    borderRadius: 6,
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#ddd',
    border: '1px solid #444',
    borderRadius: 6,
    padding: '7px 14px',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: '600',
  },
};
