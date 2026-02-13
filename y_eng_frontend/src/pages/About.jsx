// src/pages/About.jsx
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f8f8f8' }}>

      {/* Header */}
      <section style={styles.header}>
        <div style={styles.container}>
          <h1 style={styles.heroTitle}>About <span style={{ color: '#E65C00' }}>Us</span></h1>
          <p style={styles.heroSub}>
            Learn about Yashoda Engineers — our story, our mission, and our commitment to quality.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.storyGrid}>
            <div>
              <h2 style={styles.sectionTitle}>Our Story</h2>
              <p style={styles.storyText}>
                Yashoda Engineers has been serving the community for over 15 years,
                providing quality electrical equipment and professional repair services.
                What started as a small repair shop has grown into a trusted destination
                for customers seeking reliable electrical solutions.
              </p>
              <p style={styles.storyText}>
                We specialize in water motors, electric spray guns, chain saws, air compressors,
                and a wide range of electrical equipment. Our team of experienced technicians
                ensures that every product we sell and repair meets the highest quality standards.
              </p>
              <p style={styles.storyText}>
                Our commitment is simple: provide honest advice, fair prices, and service
                that keeps our customers coming back.
              </p>
            </div>

            {/* Stats */}
            <div style={styles.statsGrid}>
              {stats.map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={styles.statIcon}>{s.icon}</div>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ ...styles.section, backgroundColor: 'white' }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Our Values</h2>
          <div style={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={i} style={styles.valueCard}>
                <div style={styles.valueIcon}>{v.icon}</div>
                <h3 style={styles.valueTitle}>{v.title}</h3>
                <p style={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Come Visit Our Shop!</h2>
        <p style={styles.ctaSub}>We'd love to meet you and help with your electrical needs.</p>
        <Link to="/contact" style={styles.ctaBtn}>Get in Touch →</Link>
      </section>

    </div>
  );
}

const stats = [
  { icon: '📅', value: '15+',   label: 'Years in Business' },
  { icon: '😊', value: '1000+', label: 'Happy Customers'   },
  { icon: '🔧', value: '5000+', label: 'Repairs Done'      },
  { icon: '📦', value: '500+',  label: 'Products Available'},
];
const values = [
  { icon: '💎', title: 'Quality',    desc: 'We never compromise on the quality of products and services we provide.' },
  { icon: '🤝', title: 'Integrity',  desc: 'Honest advice, transparent pricing — no hidden costs, ever.' },
  { icon: '⚡', title: 'Efficiency', desc: 'We value your time. Fast repairs and quick service, always.' },
  { icon: '❤️', title: 'Community',  desc: 'We care about the customers and communities we serve.' },
];

const styles = {
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    padding: '80px 24px', textAlign: 'center',
  },
  heroTitle: { fontSize: 48, fontWeight: '900', color: 'white', margin: '0 0 16px 0' },
  heroSub: { fontSize: 18, color: '#aab', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 },
  section: { padding: '80px 0' },
  sectionTitle: { fontSize: 32, fontWeight: '800', color: '#1a1a2e', margin: '0 0 24px 0' },
  storyGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 60, alignItems: 'start',
    '@media(max-width:768px)': { gridTemplateColumns: '1fr' },
  },
  storyText: { fontSize: 16, color: '#555', lineHeight: 1.8, margin: '0 0 16px 0' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
  },
  statCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 24, textAlign: 'center', border: '1px solid #eee',
  },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 32, fontWeight: '900', color: '#E65C00', margin: '0 0 4px 0' },
  statLabel: { fontSize: 13, color: '#888' },
  valuesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24,
  },
  valueCard: {
    padding: 28, backgroundColor: '#f8f8f8',
    borderRadius: 12, textAlign: 'center',
  },
  valueIcon: { fontSize: 36, marginBottom: 16 },
  valueTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', margin: '0 0 10px 0' },
  valueDesc: { fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 },
  cta: {
    background: 'linear-gradient(135deg, #E65C00, #FF8C00)',
    padding: '80px 24px', textAlign: 'center',
  },
  ctaTitle: { fontSize: 32, fontWeight: '800', color: 'white', margin: '0 0 12px 0' },
  ctaSub: { fontSize: 17, color: 'rgba(255,255,255,0.85)', margin: '0 0 32px 0' },
  ctaBtn: {
    display: 'inline-block', backgroundColor: 'white', color: '#E65C00',
    padding: '14px 32px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 15,
  },
};
