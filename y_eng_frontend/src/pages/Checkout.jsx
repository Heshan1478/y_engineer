// src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { cartAPI, orderAPI } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'cash_on_delivery',
    notes: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Pre-fill form with user data
      setForm(prev => ({
        ...prev,
        customerName: user.user_metadata?.full_name || user.email.split('@')[0],
      }));

      const response = await cartAPI.getByUser(user.id);
      if (response.data.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const orderData = {
        userId: user.id,
        totalAmount: calculateTotal(),
        status: 'pending',
        paymentMethod: form.paymentMethod,
        shippingAddress: form.shippingAddress,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        notes: form.notes || null,
      };

      const response = await orderAPI.create(orderData);
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { order: response.data }
      });

    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.checkoutLayout}>
          
          {/* Checkout Form */}
          <div style={styles.formSection}>
            <form onSubmit={handleSubmit}>
              
              {/* Shipping Information */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Shipping Information</h2>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    name="customerName"
                    required
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <input
                    name="customerPhone"
                    required
                    value={form.customerPhone}
                    onChange={handleChange}
                    placeholder="076 389 0902"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Shipping Address *</label>
                  <textarea
                    name="shippingAddress"
                    required
                    value={form.shippingAddress}
                    onChange={handleChange}
                    placeholder="Enter your full address with landmarks..."
                    rows={4}
                    style={styles.textarea}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Payment Method</h2>

                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={form.paymentMethod === 'cash_on_delivery'}
                      onChange={handleChange}
                    />
                    <div style={styles.radioContent}>
                      <span style={styles.radioTitle}>💵 Cash on Delivery</span>
                      <span style={styles.radioDesc}>Pay when you receive the product</span>
                    </div>
                  </label>

                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={form.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                    />
                    <div style={styles.radioContent}>
                      <span style={styles.radioTitle}>🏦 Bank Transfer</span>
                      <span style={styles.radioDesc}>Transfer to our bank account (details after order)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Additional Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions for delivery..."
                  rows={3}
                  style={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.submitBtn,
                  backgroundColor: submitting ? '#ccc' : '#E65C00',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={styles.summarySection}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>

              {/* Items */}
              <div style={styles.itemsList}>
                {cartItems.map((item) => (
                  <div key={item.id} style={styles.summaryItem}>
                    <div style={styles.summaryItemInfo}>
                      <span style={styles.summaryItemName}>
                        {item.product.name}
                      </span>
                      <span style={styles.summaryItemQty}>
                        x{item.quantity}
                      </span>
                    </div>
                    <span style={styles.summaryItemPrice}>
                      Rs. {(Number(item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr style={styles.divider} />

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>Rs. {calculateTotal().toLocaleString()}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: '#2e7d32', fontWeight: '600' }}>FREE</span>
              </div>

              <hr style={styles.divider} />

              <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                <span>Total</span>
                <span>Rs. {calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
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
  container: { maxWidth: 1200, margin: '0 auto' },
  centered: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '60vh',
  },
  title: {
    fontSize: 32, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 32px 0',
  },
  errorBox: {
    backgroundColor: '#fce4ec', color: '#c62828',
    padding: 14, borderRadius: 8, marginBottom: 24,
    fontWeight: '600',
  },
  checkoutLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 24,
    alignItems: 'start',
  },
  formSection: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 20, fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 20px 0',
  },
  formGroup: { marginBottom: 20 },
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
    display: 'flex', alignItems: 'flex-start', gap: 12,
    cursor: 'pointer', padding: 16,
    border: '2px solid #e0e0e0', borderRadius: 8,
  },
  radioContent: {
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  radioTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  radioDesc: { fontSize: 13, color: '#888' },
  submitBtn: {
    width: '100%', padding: 14,
    color: 'white', border: 'none',
    borderRadius: 8, fontSize: 16, fontWeight: '700',
  },
  summarySection: { position: 'sticky', top: 20 },
  summaryCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  summaryTitle: {
    fontSize: 20, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 20px 0',
  },
  itemsList: {
    display: 'flex', flexDirection: 'column', gap: 12,
    marginBottom: 16,
  },
  summaryItem: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryItemInfo: {
    display: 'flex', flexDirection: 'column', gap: 2,
  },
  summaryItemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  summaryItemQty: { fontSize: 12, color: '#999' },
  summaryItemPrice: { fontSize: 14, fontWeight: '700', color: '#E65C00' },
  divider: {
    border: 'none', borderTop: '1px solid #f0f0f0',
    margin: '16px 0',
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 15, marginBottom: 12,
  },
  totalRow: {
    fontSize: 20, fontWeight: '800', color: '#1a1a2e',
  },
};
