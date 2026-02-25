// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (user) {
      getUserRole();
    }
  }, [user]);

  const getUserRole = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setUserRole(profile?.role || 'customer');
    } catch (err) {
      console.error('Error fetching role:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>
            Yashoda <span style={styles.logoOrange}>Engineers</span>
          </span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/services" style={styles.link}>Services</Link>
          <Link to="/about" style={styles.link}>About</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
          
          {user && (
            <Link to="/dashboard" style={{...styles.link, ...styles.dashboardLink}}>
              {userRole === 'admin' ? '🔧 Dashboard' : '📊 Dashboard'}
            </Link>
          )}
        </div>

        <div style={styles.actions}>
          {user ? (
            <>
              <Link to="/cart" style={styles.cartBtn}>
                🛒
              </Link>
              <div style={styles.userMenu}>
                <span style={styles.userName}>👤 {user.email.split('@')[0]}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: { backgroundColor: '#1a1a2e', padding: '16px 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' },
  container: { maxWidth: 1400, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 24, fontWeight: '800' },
  logoIcon: { fontSize: 28 },
  logoText: { color: 'white' },
  logoOrange: { color: '#E65C00' },
  links: { display: 'flex', gap: 24, alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: '600', transition: 'color 0.2s' },
  dashboardLink: { backgroundColor: '#E65C00', padding: '8px 16px', borderRadius: 6 },
  actions: { display: 'flex', gap: 16, alignItems: 'center' },
  cartBtn: { position: 'relative', color: 'white', fontSize: 24, textDecoration: 'none' },
  userMenu: { display: 'flex', gap: 12, alignItems: 'center' },
  userName: { color: 'white', fontSize: 14 },
  logoutBtn: { backgroundColor: '#E65C00', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: '600', cursor: 'pointer' },
  loginBtn: { backgroundColor: '#E65C00', color: 'white', padding: '10px 24px', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: '700', textDecoration: 'none', display: 'inline-block' },
};