// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => {});
    productAPI.getAll().then(r => setFeaturedProducts(r.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f8f8f8' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>⚡ Trusted Since 2010</div>
          <h1 style={styles.heroTitle}>
            Yashoda<br />
            <span style={styles.heroAccent}>Engineers</span>
          </h1>
          <p style={styles.heroSub}>
            Your trusted partner for quality electrical equipment,<br />
            water motors, compressors & professional repair services.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/products" style={styles.heroBtnPrimary}>
              Browse Products
            </Link>
            <Link to="/services" style={styles.heroBtnSecondary}>
              Our Services
            </Link>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}><strong>500+</strong><span>Products</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><strong>1000+</strong><span>Happy Customers</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><strong>15+</strong><span>Years Experience</span></div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Shop by Category</h2>
            <p style={styles.sectionSub}>Find exactly what you need</p>
          </div>

          {categories.length > 0 ? (
            <div style={styles.categoryGrid}>
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={styles.categoryCard}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.borderColor = '#E65C00';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#eee';
                    }}
                  >
                    <span style={styles.categoryIcon}>
                      {categoryIcons[i % categoryIcons.length]}
                    </span>
                    <span style={styles.categoryName}>{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={styles.categoryGrid}>
              {defaultCategories.map((cat, i) => (
                <Link key={i} to="/products" style={{ textDecoration: 'none' }}>
                  <div style={styles.categoryCard}>
                    <span style={styles.categoryIcon}>{cat.icon}</span>
                    <span style={styles.categoryName}>{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section style={{ ...styles.section, backgroundColor: 'white' }}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Featured Products</h2>
              <p style={styles.sectionSub}>Top picks from our collection</p>
            </div>
            <div style={styles.productGrid}>
              {featuredProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={styles.productCard}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={styles.productImg}>⚙️</div>
                    {product.category && (
                      <span style={styles.productTag}>{product.category.name}</span>
                    )}
                    <h4 style={styles.productName}>{product.name}</h4>
                    <div style={styles.productBottom}>
                      <span style={styles.productPrice}>
                        Rs. {Number(product.price).toLocaleString()}
                      </span>
                      <span style={styles.viewLink}>View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link to="/products" style={styles.viewAllBtn}>
                View All Products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ────────────────────────────────── */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
            <p style={styles.sectionSub}>We're committed to quality and service</p>
          </div>
          <div style={styles.whyGrid}>
            {whyUs.map((item, i) => (
              <div key={i} style={styles.whyCard}>
                <div style={styles.whyIcon}>{item.icon}</div>
                <h3 style={styles.whyTitle}>{item.title}</h3>
                <p style={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section style={styles.cta}>
        <div style={styles.container}>
          <h2 style={styles.ctaTitle}>Need a Repair? We're Here to Help!</h2>
          <p style={styles.ctaSub}>
            Bring your electrical equipment to us — fast, reliable repair services.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" style={styles.ctaBtnPrimary}>View Repair Services</Link>
            <a
              href="https://wa.me/94763890902?text=Hi Yashoda Engineers, I need a repair service."
              target="_blank"
              rel="noreferrer"
              style={styles.ctaBtnWhatsapp}
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={styles.footer}>
        <div style={{ ...styles.container, ...styles.footerInner }}>
          <div>
            <div style={styles.footerLogo}>⚡ Yashoda Engineers</div>
            <p style={styles.footerTagline}>Quality electrical equipment & repair services.</p>
          </div>
          <div>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            {['/', '/products', '/services', '/about', '/contact'].map((path, i) => (
              <div key={i}>
                <Link
                  to={path}
                  style={styles.footerLink}
                >
                  {['Home', 'Products', 'Services', 'About', 'Contact'][i]}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={styles.footerHeading}>Contact</h4>
            <p style={styles.footerText}>📞 076 389 0902</p>
            <p style={styles.footerText}>📍 Sri Lanka</p>
            <a
              href="https://wa.me/94763890902"
              target="_blank"
              rel="noreferrer"
              style={styles.whatsappFooterBtn}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
        <div style={styles.footerBottom}>
          © 2026 Yashoda Engineers. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

// ── Data ────────────────────────────────────────────────────
const categoryIcons = ['💧', '🔫', '🪚', '💨', '🔧', '⚡'];
const defaultCategories = [
  { name: 'Water Motors',      icon: '💧' },
  { name: 'Electric Spray Guns', icon: '🔫' },
  { name: 'Chain Saws',        icon: '🪚' },
  { name: 'Compressors',       icon: '💨' },
  { name: 'Repair Parts',      icon: '🔧' },
  { name: 'Other Equipment',   icon: '⚡' },
];
const whyUs = [
  { icon: '✅', title: 'Quality Products',     desc: 'We stock only trusted brands and quality-tested electrical equipment.' },
  { icon: '🔧', title: 'Expert Repairs',       desc: 'Our skilled technicians handle all types of electrical equipment repairs.' },
  { icon: '💰', title: 'Competitive Prices',   desc: 'Get the best value for your money with our fair and transparent pricing.' },
  { icon: '⚡', title: 'Fast Service',         desc: 'Quick turnaround on repairs and same-day delivery on most products.' },
  { icon: '🤝', title: 'Trusted by 1000+',     desc: 'Over a decade of serving customers across the region with excellence.' },
  { icon: '📞', title: '24/7 Support',         desc: 'Reach us anytime via WhatsApp or phone for queries and assistance.' },
];

// ── Styles ──────────────────────────────────────────────────
const styles = {
  hero: {
    position: 'relative',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    minHeight: '88vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 70% 50%, rgba(230,92,0,0.15) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    maxWidth: 1200, margin: '0 auto',
    padding: '80px 24px',
    zIndex: 1,
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: 'rgba(230,92,0,0.2)',
    color: '#FF8C00',
    border: '1px solid rgba(230,92,0,0.4)',
    padding: '6px 18px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 24,
    letterSpacing: '0.5px',
  },
  heroTitle: {
    fontSize: 'clamp(48px, 8vw, 88px)',
    fontWeight: '900',
    color: 'white',
    margin: '0 0 8px 0',
    lineHeight: 1.05,
    letterSpacing: '-2px',
  },
  heroAccent: { color: '#E65C00' },
  heroSub: {
    fontSize: 18,
    color: '#aab',
    margin: '20px 0 36px 0',
    lineHeight: 1.7,
    maxWidth: 520,
  },
  heroButtons: {
    display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48,
  },
  heroBtnPrimary: {
    backgroundColor: '#E65C00', color: 'white',
    padding: '14px 32px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 16,
  },
  heroBtnSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '14px 32px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '600', fontSize: 16,
  },
  heroStats: {
    display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap',
  },
  stat: {
    display: 'flex', flexDirection: 'column', color: 'white',
    '& strong': { fontSize: 28, fontWeight: '800' },
    '& span':   { fontSize: 13, color: '#aab' },
  },
  statDivider: {
    width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    padding: '80px 0', backgroundColor: '#f8f8f8',
  },
  container: {
    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
  },
  sectionHeader: {
    textAlign: 'center', marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 32, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  sectionSub: {
    color: '#888', fontSize: 16, margin: 0,
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 16,
  },
  categoryCard: {
    backgroundColor: 'white',
    border: '2px solid #eee',
    borderRadius: 12,
    padding: '28px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, border-color 0.2s',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 12,
  },
  categoryIcon: { fontSize: 40 },
  categoryName: {
    fontSize: 14, fontWeight: '700', color: '#1a1a2e',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 24,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  productImg: {
    height: 140, backgroundColor: '#f8f8f8',
    borderRadius: 8, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 56, marginBottom: 14,
  },
  productTag: {
    display: 'inline-block',
    backgroundColor: '#fff3e0', color: '#E65C00',
    padding: '3px 10px', borderRadius: 12,
    fontSize: 12, fontWeight: '600', marginBottom: 8,
  },
  productName: {
    fontSize: 15, fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 12px 0',
  },
  productBottom: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  productPrice: {
    fontSize: 18, fontWeight: '800', color: '#E65C00',
  },
  viewLink: {
    fontSize: 13, color: '#E65C00', fontWeight: '600',
  },
  viewAllBtn: {
    display: 'inline-block',
    backgroundColor: '#1a1a2e', color: 'white',
    padding: '14px 32px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 15,
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24,
  },
  whyCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 28, border: '1px solid #eee',
  },
  whyIcon: { fontSize: 36, marginBottom: 16 },
  whyTitle: {
    fontSize: 17, fontWeight: '700', color: '#1a1a2e', margin: '0 0 10px 0',
  },
  whyDesc: {
    fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0,
  },
  cta: {
    background: 'linear-gradient(135deg, #E65C00, #FF8C00)',
    padding: '80px 24px', textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 32, fontWeight: '800', color: 'white',
    margin: '0 0 12px 0',
  },
  ctaSub: {
    fontSize: 17, color: 'rgba(255,255,255,0.85)',
    margin: '0 0 36px 0',
  },
  ctaBtnPrimary: {
    display: 'inline-block',
    backgroundColor: 'white', color: '#E65C00',
    padding: '14px 32px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 15,
  },
  ctaBtnWhatsapp: {
    display: 'inline-block',
    backgroundColor: '#25D366', color: 'white',
    padding: '14px 32px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 15,
  },
  footer: {
    backgroundColor: '#1a1a2e', color: '#aab',
  },
  footerInner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 40, padding: '60px 24px',
  },
  footerLogo: {
    fontSize: 20, fontWeight: '800', color: 'white',
    marginBottom: 12,
  },
  footerTagline: { fontSize: 14, lineHeight: 1.7, margin: 0 },
  footerHeading: {
    fontSize: 14, fontWeight: '700', color: 'white',
    textTransform: 'uppercase', letterSpacing: 1,
    margin: '0 0 16px 0',
  },
  footerLink: {
    display: 'block', color: '#aab',
    textDecoration: 'none', fontSize: 14,
    marginBottom: 8, lineHeight: 1.8,
  },
  footerText: { fontSize: 14, margin: '0 0 8px 0' },
  whatsappFooterBtn: {
    display: 'inline-block', marginTop: 12,
    backgroundColor: '#25D366', color: 'white',
    padding: '8px 16px', borderRadius: 6,
    textDecoration: 'none', fontSize: 13, fontWeight: '600',
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center', padding: '20px 24px',
    fontSize: 13, color: '#556',
  },
};
