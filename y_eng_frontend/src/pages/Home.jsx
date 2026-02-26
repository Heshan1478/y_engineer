// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>⚡ Trusted Since 2010</div>
          <h1 style={styles.title}>Yashoda Engineers</h1>
          <p style={styles.subtitle}>
            Your trusted partner for quality electrical equipment,
            <br />
            water motors, compressors & professional repair services.
          </p>
          <div style={styles.heroButtons}>
            <button onClick={() => navigate('/products')} style={styles.primaryBtn}>
              Browse Products
            </button>
            <button onClick={() => navigate('/services')} style={styles.secondaryBtn}>
              Our Services
            </button>
          </div>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <h2 style={styles.statNumber}>500+</h2>
          <p style={styles.statLabel}>Products</p>
        </div>
        <div style={styles.statItem}>
          <h2 style={styles.statNumber}>1000+</h2>
          <p style={styles.statLabel}>Happy Customers</p>
        </div>
        <div style={styles.statItem}>
          <h2 style={styles.statNumber}>15+</h2>
          <p style={styles.statLabel}>Years Experience</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#1a1a2e', fontFamily: "'Segoe UI', sans-serif" },
  hero: { padding: '100px 20px', textAlign: 'center' },
  heroContent: { maxWidth: 800, margin: '0 auto' },
  badge: { display: 'inline-block', backgroundColor: '#E65C00', color: 'white', padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: '600', marginBottom: 24 },
  title: { fontSize: 72, fontWeight: '900', color: 'white', margin: '0 0 16px 0' },
  subtitle: { fontSize: 20, color: '#aab', margin: '0 0 40px 0', lineHeight: 1.6 },
  heroButtons: { display: 'flex', gap: 16, justifyContent: 'center' },
  primaryBtn: { backgroundColor: '#E65C00', color: 'white', padding: '16px 32px', fontSize: 16, fontWeight: '700', border: 'none', borderRadius: 8, cursor: 'pointer' },
  secondaryBtn: { backgroundColor: 'transparent', color: 'white', padding: '16px 32px', fontSize: 16, fontWeight: '700', border: '2px solid white', borderRadius: 8, cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, maxWidth: 800, margin: '60px auto', padding: '0 20px' },
  statItem: { textAlign: 'center' },
  statNumber: { fontSize: 48, fontWeight: '900', color: '#E65C00', margin: '0 0 8px 0' },
  statLabel: { fontSize: 16, color: '#aab', margin: 0 },
};