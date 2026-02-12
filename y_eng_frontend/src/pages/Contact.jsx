// src/pages/Contact.jsx
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build WhatsApp message from form
    const msg = `Hi Yashoda Engineers!%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0A%0AMessage: ${form.message}`;
    window.open(`https://wa.me/94763890902?text=${msg}`, '_blank');
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f8f8f8' }}>

      {/* Header */}
      <section style={styles.header}>
        <div style={styles.container}>
          <h1 style={styles.heroTitle}>Contact <span style={{ color: '#E65C00' }}>Us</span></h1>
          <p style={styles.heroSub}>
            We're here to help! Reach out via phone, WhatsApp, or visit our shop.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.grid}>

            {/* Left: Contact Info */}
            <div>
              <h2 style={styles.sectionTitle}>Get in Touch</h2>

              {contactInfo.map((item, i) => (
                <div key={i} style={styles.infoCard}>
                  <div style={styles.infoIcon}>{item.icon}</div>
                  <div>
                    <div style={styles.infoLabel}>{item.label}</div>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer" style={styles.infoValue}>
                        {item.value}
                      </a>
                    ) : (
                      <div style={styles.infoValue}>{item.value}</div>
                    )}
                    {item.sub && <div style={styles.infoSub}>{item.sub}</div>}
                  </div>
                </div>
              ))}

              {/* WhatsApp Big Button */}
              <a
                href="https://wa.me/94763890902?text=Hi Yashoda Engineers!"
                target="_blank"
                rel="noreferrer"
                style={styles.whatsappBtn}
              >
                💬 Chat on WhatsApp Now
              </a>

              {/* Business Hours */}
              <div style={styles.hoursCard}>
                <h3 style={styles.hoursTitle}>🕐 Business Hours</h3>
                {hours.map((h, i) => (
                  <div key={i} style={styles.hourRow}>
                    <span style={styles.hourDay}>{h.day}</span>
                    <span style={styles.hourTime}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Inquiry Form */}
            <div>
              <h2 style={styles.sectionTitle}>Send an Inquiry</h2>
              <div style={styles.formCard}>

                {sent && (
                  <div style={styles.successMsg}>
                    ✅ Opening WhatsApp with your message...
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Your Name *</label>
                    <input
                      name="name" required value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      name="email" type="email" value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone</label>
                    <input
                      name="phone" value={form.phone}
                      onChange={handleChange}
                      placeholder="076 389 0902"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Message *</label>
                    <textarea
                      name="message" required value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      style={{ ...styles.input, resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" style={styles.submitBtn}>
                    Send via WhatsApp →
                  </button>
                  <p style={styles.formNote}>
                    * This will open WhatsApp with your message pre-filled.
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

const contactInfo = [
  {
    icon: '📞',
    label: 'Phone',
    value: '076 389 0902',
    link: 'tel:+94763890902',
    sub: 'Available during business hours',
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: '+94 763 890 902',
    link: 'https://wa.me/94763890902',
    sub: 'Quick response guaranteed',
  },
  {
    icon: '📍',
    label: 'Location',
    value: 'Sri Lanka',
    sub: 'Visit us at our shop',
  },
  {
    icon: '📧',
    label: 'Email',
    value: 'yashodaengineers@email.com',
    sub: 'We reply within 24 hours',
  },
];

const hours = [
  { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday',        time: '8:00 AM – 4:00 PM' },
  { day: 'Sunday',          time: 'Closed'             },
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
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 60, alignItems: 'start',
  },
  sectionTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', margin: '0 0 28px 0' },
  infoCard: {
    display: 'flex', gap: 16, alignItems: 'flex-start',
    backgroundColor: 'white', borderRadius: 10,
    padding: '16px 20px', marginBottom: 12,
    border: '1px solid #eee',
  },
  infoIcon: { fontSize: 28, flexShrink: 0, marginTop: 2 },
  infoLabel: { fontSize: 12, color: '#999', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoValue: {
    fontSize: 16, fontWeight: '700', color: '#1a1a2e',
    textDecoration: 'none', display: 'block',
  },
  infoSub: { fontSize: 13, color: '#888', marginTop: 2 },
  whatsappBtn: {
    display: 'block', backgroundColor: '#25D366',
    color: 'white', padding: '14px 24px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 16,
    textAlign: 'center', margin: '20px 0',
  },
  hoursCard: {
    backgroundColor: 'white', borderRadius: 10,
    padding: '20px 24px', border: '1px solid #eee',
    marginTop: 20,
  },
  hoursTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px 0' },
  hourRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid #f5f5f5',
    fontSize: 14,
  },
  hourDay: { color: '#555', fontWeight: '500' },
  hourTime: { color: '#1a1a2e', fontWeight: '700' },
  formCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 32, border: '1px solid #eee',
  },
  formGroup: { marginBottom: 20 },
  label: {
    display: 'block', fontSize: 14, fontWeight: '600',
    color: '#333', marginBottom: 6,
  },
  input: {
    width: '100%', padding: '12px 14px', fontSize: 15,
    border: '2px solid #eee', borderRadius: 8,
    boxSizing: 'border-box', outline: 'none',
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%', padding: 14, fontSize: 16,
    backgroundColor: '#25D366', color: 'white',
    border: 'none', borderRadius: 8, cursor: 'pointer',
    fontWeight: '700',
  },
  formNote: { fontSize: 12, color: '#999', marginTop: 10, textAlign: 'center' },
  successMsg: {
    backgroundColor: '#e8f5e9', color: '#2e7d32',
    padding: 12, borderRadius: 8, marginBottom: 20,
    fontWeight: '600', textAlign: 'center',
  },
};
