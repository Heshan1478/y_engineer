// src/pages/Services.jsx
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f8f8f8' }}>

      {/* Header */}
      <section style={styles.header}>
        <div style={styles.container}>
          <h1 style={styles.heroTitle}>Repair <span style={{ color: '#E65C00' }}>Services</span></h1>
          <p style={styles.heroSub}>
            Professional repair and maintenance for all types of electrical equipment.
            Fast turnaround, quality guaranteed.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What We Repair</h2>
          <div style={styles.serviceGrid}>
            {services.map((s, i) => (
              <div key={i} style={styles.serviceCard}>
                <div style={styles.serviceIcon}>{s.icon}</div>
                <h3 style={styles.serviceTitle}>{s.title}</h3>
                <p style={styles.serviceDesc}>{s.desc}</p>
                <ul style={styles.serviceList}>
                  {s.items.map((item, j) => (
                    <li key={j} style={styles.serviceItem}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ ...styles.section, backgroundColor: 'white' }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.stepsRow}>
            {steps.map((step, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepNumber}>{i + 1}</div>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h4 style={styles.stepTitle}>{step.title}</h4>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <div style={styles.container}>
          <h2 style={styles.ctaTitle}>Ready to get your equipment repaired?</h2>
          <p style={styles.ctaSub}>Contact us via WhatsApp or visit our shop.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/94763890902?text=Hi, I need a repair service."
              target="_blank"
              rel="noreferrer"
              style={styles.whatsappBtn}
            >
              💬 WhatsApp: 076 389 0902
            </a>
            <Link to="/contact" style={styles.contactBtn}>
              View Contact Details
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

const services = [
  {
    icon: '💧', title: 'Water Motor Repair',
    desc: 'Complete repair and maintenance services for all types of water motors.',
    items: ['Single phase motors', 'Three phase motors', 'Submersible pumps', 'Centrifugal pumps'],
  },
  {
    icon: '🔫', title: 'Spray Gun Service',
    desc: 'Professional servicing and repair of electric spray guns.',
    items: ['Motor replacement', 'Pressure calibration', 'Nozzle repair', 'Full cleaning service'],
  },
  {
    icon: '🪚', title: 'Chain Saw Repair',
    desc: 'Expert repair for all brands of electric and petrol chain saws.',
    items: ['Chain sharpening', 'Motor overhaul', 'Bar replacement', 'Safety checks'],
  },
  {
    icon: '💨', title: 'Compressor Repair',
    desc: 'Air compressor repair and maintenance for home and industrial use.',
    items: ['Pressure valve repair', 'Motor service', 'Tank inspection', 'Air leakage fix'],
  },
  {
    icon: '⚡', title: 'General Electrical',
    desc: 'General electrical equipment repair and maintenance.',
    items: ['Winding repair', 'Capacitor replacement', 'Switch repair', 'Control panel service'],
  },
  {
    icon: '🔧', title: 'Preventive Maintenance',
    desc: 'Regular maintenance services to keep your equipment running efficiently.',
    items: ['Lubrication', 'Cleaning & inspection', 'Parts replacement', 'Performance testing'],
  },
];

const steps = [
  { icon: '📞', title: 'Contact Us',    desc: 'Call or WhatsApp us to describe the issue with your equipment.' },
  { icon: '📦', title: 'Bring it In',   desc: 'Bring your equipment to our shop. We also offer pickup for large items.' },
  { icon: '🔍', title: 'Diagnosis',     desc: 'Our technician inspects the equipment and provides a repair quote.' },
  { icon: '🔧', title: 'Repair',        desc: 'We repair your equipment using quality parts with care and expertise.' },
  { icon: '✅', title: 'Ready to Go',   desc: 'Pick up your repaired equipment. We offer a service warranty.' },
];

const styles = {
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    padding: '80px 24px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 48, fontWeight: '900', color: 'white',
    margin: '0 0 16px 0',
  },
  heroSub: {
    fontSize: 18, color: '#aab', maxWidth: 560,
    margin: '0 auto', lineHeight: 1.7,
  },
  section: { padding: '80px 0', backgroundColor: '#f8f8f8' },
  sectionTitle: {
    fontSize: 32, fontWeight: '800', color: '#1a1a2e',
    textAlign: 'center', margin: '0 0 48px 0',
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
  },
  serviceCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 28, border: '1px solid #eee',
  },
  serviceIcon: { fontSize: 40, marginBottom: 16 },
  serviceTitle: {
    fontSize: 18, fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 10px 0',
  },
  serviceDesc: {
    fontSize: 14, color: '#666', lineHeight: 1.7,
    margin: '0 0 16px 0',
  },
  serviceList: { paddingLeft: 0, listStyle: 'none', margin: 0 },
  serviceItem: {
    fontSize: 13, color: '#2e7d32', padding: '4px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 24,
  },
  stepCard: {
    textAlign: 'center', padding: 24,
    backgroundColor: '#f8f8f8', borderRadius: 12,
  },
  stepNumber: {
    width: 32, height: 32, borderRadius: '50%',
    backgroundColor: '#E65C00', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', fontSize: 14,
    margin: '0 auto 12px auto',
  },
  stepIcon: { fontSize: 32, marginBottom: 12 },
  stepTitle: {
    fontSize: 15, fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  stepDesc: {
    fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0,
  },
  cta: {
    background: 'linear-gradient(135deg, #E65C00, #FF8C00)',
    padding: '80px 24px', textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 30, fontWeight: '800', color: 'white',
    margin: '0 0 12px 0',
  },
  ctaSub: {
    fontSize: 16, color: 'rgba(255,255,255,0.85)',
    margin: '0 0 32px 0',
  },
  whatsappBtn: {
    display: 'inline-block', backgroundColor: '#25D366',
    color: 'white', padding: '14px 28px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 15,
  },
  contactBtn: {
    display: 'inline-block', backgroundColor: 'white',
    color: '#E65C00', padding: '14px 28px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 15,
  },
};
