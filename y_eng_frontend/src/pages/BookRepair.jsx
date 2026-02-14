// src/pages/BookRepair.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { repairAPI } from '../services/api';

export default function BookRepair() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedType = location.state?.serviceType || '';

  const [form, setForm] = useState({
    equipmentType: preselectedType,
    brand: '',
    issueDescription: '',
    urgency: 'normal',
    serviceType: 'dropoff',
    pickupAddress: '',
    preferredDate: '',
    preferredTime: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Prepare repair request data
      const repairData = {
        userId: user.id,
        customerName: user.user_metadata?.full_name || user.email.split('@')[0],
        customerEmail: user.email,
        customerPhone: user.user_metadata?.phone || '',
        equipmentType: form.equipmentType,
        brand: form.brand,
        issueDescription: form.issueDescription,
        urgency: form.urgency,
        serviceType: form.serviceType,
        pickupAddress: form.serviceType === 'pickup' ? form.pickupAddress : null,
        preferredDate: form.preferredDate || null,
        preferredTime: form.preferredTime || null,
        status: 'pending',
      };

      // Submit to backend
      await repairAPI.create(repairData);

      // Success! Redirect to dashboard
      navigate('/dashboard', { state: { message: '✅ Repair request submitted successfully!' } });
    } catch (err) {
      console.error('Error submitting repair request:', err);
      setError('Failed to submit repair request. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Book a Repair</h1>
          <p style={styles.subtitle}>
            Fill in the details below and we'll get back to you within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <div style={styles.card}>
          {error && (
            <div style={styles.errorBox}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Equipment Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Equipment Type *</label>
              <select
                name="equipmentType"
                required
                value={form.equipmentType}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select equipment type</option>
                <option value="Water Motor">Water Motor</option>
                <option value="Electric Spray Gun">Electric Spray Gun</option>
                <option value="Chain Saw">Chain Saw</option>
                <option value="Compressor">Compressor</option>
                <option value="Electrical Equipment">Electrical Equipment</option>
                <option value="Wiring/Switchboard">Wiring/Switchboard</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Brand/Model */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Brand / Model (Optional)</label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Bosch, Makita, Dewalt..."
                style={styles.input}
              />
            </div>

            {/* Issue Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Describe the Issue *</label>
              <textarea
                name="issueDescription"
                required
                value={form.issueDescription}
                onChange={handleChange}
                placeholder="Tell us what's wrong with your equipment..."
                rows={5}
                style={styles.textarea}
              />
            </div>

            {/* Urgency */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Urgency *</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="urgency"
                    value="normal"
                    checked={form.urgency === 'normal'}
                    onChange={handleChange}
                  />
                  <span style={styles.radioText}>Normal (3-5 days)</span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="urgency"
                    value="urgent"
                    checked={form.urgency === 'urgent'}
                    onChange={handleChange}
                  />
                  <span style={styles.radioText}>Urgent (1-2 days) - Extra fee applies</span>
                </label>
              </div>
            </div>

            {/* Service Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Type *</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="serviceType"
                    value="dropoff"
                    checked={form.serviceType === 'dropoff'}
                    onChange={handleChange}
                  />
                  <span style={styles.radioText}>Drop-off at shop (Free)</span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="serviceType"
                    value="pickup"
                    checked={form.serviceType === 'pickup'}
                    onChange={handleChange}
                  />
                  <span style={styles.radioText}>Pickup from my location (Rs. 500)</span>
                </label>
              </div>
            </div>

            {/* Pickup Address (conditional) */}
            {form.serviceType === 'pickup' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Pickup Address *</label>
                <textarea
                  name="pickupAddress"
                  required={form.serviceType === 'pickup'}
                  value={form.pickupAddress}
                  onChange={handleChange}
                  placeholder="Enter your full address with landmarks..."
                  rows={3}
                  style={styles.textarea}
                />
              </div>
            )}

            {/* Preferred Date & Time */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Date (Optional)</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={form.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Time (Optional)</label>
                <select
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select time</option>
                  <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                </select>
              </div>
            </div>

            {/* Info Note */}
            <div style={styles.infoBox}>
              <strong>📌 What happens next?</strong><br />
              1. We'll review your request within 24 hours<br />
              2. You'll receive an approval with estimated cost<br />
              3. Track repair status in your dashboard
            </div>

            {/* Submit Button */}
            <div style={styles.buttonRow}>
              <button
                type="button"
                onClick={() => navigate('/services')}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  backgroundColor: loading ? '#ccc' : '#E65C00',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Submitting...' : 'Submit Repair Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: { maxWidth: 700, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 32 },
  title: {
    fontSize: 32, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: 16, color: '#666', margin: 0,
  },
  card: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  errorBox: {
    backgroundColor: '#fce4ec', color: '#c62828',
    padding: 14, borderRadius: 8, marginBottom: 24,
    fontWeight: '600', fontSize: 14,
  },
  formGroup: { marginBottom: 24 },
  formRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 20, marginBottom: 24,
  },
  label: {
    display: 'block', fontSize: 14, fontWeight: '700',
    color: '#333', marginBottom: 8,
  },
  input: {
    width: '100%', padding: '12px 14px', fontSize: 15,
    border: '2px solid #e0e0e0', borderRadius: 8,
    boxSizing: 'border-box', outline: 'none',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%', padding: '12px 14px', fontSize: 15,
    border: '2px solid #e0e0e0', borderRadius: 8,
    boxSizing: 'border-box', outline: 'none',
    backgroundColor: 'white', cursor: 'pointer',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%', padding: '12px 14px', fontSize: 15,
    border: '2px solid #e0e0e0', borderRadius: 8,
    boxSizing: 'border-box', outline: 'none',
    fontFamily: 'inherit', resize: 'vertical',
  },
  radioGroup: {
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  radioLabel: {
    display: 'flex', alignItems: 'center', gap: 10,
    cursor: 'pointer', padding: 12,
    border: '2px solid #e0e0e0', borderRadius: 8,
  },
  radioText: { fontSize: 15, color: '#333' },
  infoBox: {
    backgroundColor: '#e8f5e9', color: '#2e7d32',
    padding: 16, borderRadius: 8, fontSize: 14,
    lineHeight: 1.7, marginBottom: 24,
  },
  buttonRow: {
    display: 'flex', gap: 12, justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '12px 24px', fontSize: 15,
    backgroundColor: 'transparent',
    color: '#666', border: '2px solid #ddd',
    borderRadius: 8, cursor: 'pointer', fontWeight: '600',
  },
  submitBtn: {
    padding: '12px 32px', fontSize: 15,
    color: 'white', border: 'none',
    borderRadius: 8, fontWeight: '700',
  },
};
