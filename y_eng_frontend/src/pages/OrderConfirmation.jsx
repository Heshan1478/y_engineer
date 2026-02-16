// src/pages/OrderConfirmation.jsx
import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.centered}>
            <h2>Order not found</h2>
            <Link to="/products" style={styles.btn}>Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Success Message */}
        <div style={styles.successCard}>
          <div style={styles.checkmark}>✓</div>
          <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
          <p style={styles.successText}>
            Thank you for your order. We'll process it shortly.
          </p>
          <div style={styles.orderNumber}>
            Order #{order.orderNumber}
          </div>
        </div>

        {/* Order Details */}
        <div style={styles.detailsCard}>
          <h2 style={styles.detailsTitle}>Order Details</h2>

          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Customer Name:</span>
              <span style={styles.detailValue}>{order.customerName}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Phone:</span>
              <span style={styles.detailValue}>{order.customerPhone}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Payment Method:</span>
              <span style={styles.detailValue}>
                {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Bank Transfer'}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Total Amount:</span>
              <span style={{ ...styles.detailValue, color: '#E65C00', fontWeight: '800' }}>
                Rs. {Number(order.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>

          <div style={styles.addressSection}>
            <span style={styles.detailLabel}>Shipping Address:</span>
            <p style={styles.address}>{order.shippingAddress}</p>
          </div>

          {order.notes && (
            <div style={styles.notesSection}>
              <span style={styles.detailLabel}>Notes:</span>
              <p style={styles.notes}>{order.notes}</p>
            </div>
          )}

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div style={styles.itemsSection}>
              <h3 style={styles.itemsTitle}>Items Ordered</h3>
              {order.items.map((item) => (
                <div key={item.id} style={styles.orderItem}>
                  <span>{item.productName} x {item.quantity}</span>
                  <span>Rs. {(Number(item.priceAtPurchase) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div style={styles.nextSteps}>
          <h3 style={styles.nextStepsTitle}>What's Next?</h3>
          <div style={styles.stepsList}>
            <div style={styles.step}>
              <span style={styles.stepIcon}>1️⃣</span>
              <span>We'll review your order and confirm within 24 hours</span>
            </div>
            <div style={styles.step}>
              <span style={styles.stepIcon}>2️⃣</span>
              <span>Track your order status in "My Orders" page</span>
            </div>
            <div style={styles.step}>
              <span style={styles.stepIcon}>3️⃣</span>
              <span>You'll receive your order within 3-5 business days</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <Link to="/my-orders" style={styles.primaryBtn}>
            View My Orders
          </Link>
          <Link to="/products" style={styles.secondaryBtn}>
            Continue Shopping
          </Link>
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
  container: { maxWidth: 800, margin: '0 auto' },
  centered: { textAlign: 'center', padding: 60 },
  btn: {
    display: 'inline-block', backgroundColor: '#E65C00',
    color: 'white', padding: '12px 28px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', marginTop: 20,
  },
  successCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 48, textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: 24,
  },
  checkmark: {
    width: 80, height: 80, borderRadius: '50%',
    backgroundColor: '#E65C00', color: 'white',
    fontSize: 48, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 24px auto',
  },
  successTitle: {
    fontSize: 28, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 12px 0',
  },
  successText: { fontSize: 16, color: '#666', margin: '0 0 24px 0' },
  orderNumber: {
    fontSize: 20, fontWeight: '700', color: '#E65C00',
    backgroundColor: '#fff3e0', padding: '12px 24px',
    borderRadius: 8, display: 'inline-block',
  },
  detailsCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 20, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 24px 0',
  },
  detailsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 16, marginBottom: 24,
  },
  detailItem: {
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  detailLabel: {
    fontSize: 12, color: '#999', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  addressSection: {
    marginBottom: 24, paddingTop: 24,
    borderTop: '1px solid #f0f0f0',
  },
  address: {
    fontSize: 15, color: '#333', lineHeight: 1.7,
    margin: '8px 0 0 0',
  },
  notesSection: { marginBottom: 24 },
  notes: {
    fontSize: 15, color: '#333', lineHeight: 1.7,
    margin: '8px 0 0 0', backgroundColor: '#f8f8f8',
    padding: 12, borderRadius: 6,
  },
  itemsSection: {
    paddingTop: 24, borderTop: '1px solid #f0f0f0',
  },
  itemsTitle: {
    fontSize: 16, fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 16px 0',
  },
  orderItem: {
    display: 'flex', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid #f5f5f5',
    fontSize: 14,
  },
  nextSteps: {
    backgroundColor: '#e8f5e9', borderRadius: 12,
    padding: 24, marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: 18, fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 16px 0',
  },
  stepsList: {
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  step: {
    display: 'flex', gap: 12, alignItems: 'center',
    fontSize: 14, color: '#333',
  },
  stepIcon: { fontSize: 20 },
  actions: {
    display: 'flex', gap: 12, justifyContent: 'center',
  },
  primaryBtn: {
    display: 'inline-block', backgroundColor: '#E65C00',
    color: 'white', padding: '12px 28px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700',
  },
  secondaryBtn: {
    display: 'inline-block', backgroundColor: 'transparent',
    color: '#E65C00', padding: '12px 28px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700',
    border: '2px solid #E65C00',
  },
};
