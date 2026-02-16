// src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { cartAPI } from '../services/api';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      const response = await cartAPI.getByUser(user.id);
      setCartItems(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateItem(cartItemId, newQuantity);
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId);
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <h2>Loading cart...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Shopping Cart</h1>

        {error && <div style={styles.errorBox}>{error}</div>}

        {cartItems.length === 0 ? (
          <div style={styles.emptyCart}>
            <p style={{ fontSize: 64, margin: 0 }}>🛒</p>
            <h2 style={{ margin: '16px 0 8px 0' }}>Your cart is empty</h2>
            <p style={{ color: '#999', margin: '0 0 24px 0' }}>
              Add some products to get started
            </p>
            <Link to="/products" style={styles.shopBtn}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={styles.cartLayout}>
            
            {/* Cart Items */}
            <div style={styles.itemsSection}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  
                  {/* Product Image */}
                  <div style={styles.itemImage}>
                    <span style={{ fontSize: 40 }}>⚙️</span>
                  </div>

                  {/* Product Info */}
                  <div style={styles.itemInfo}>
                    <Link 
                      to={`/products/${item.product.id}`}
                      style={styles.itemName}
                    >
                      {item.product.name}
                    </Link>
                    {item.product.category && (
                      <span style={styles.itemCategory}>
                        {item.product.category.name}
                      </span>
                    )}
                    <p style={styles.itemPrice}>
                      Rs. {Number(item.product.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={styles.quantitySection}>
                    <div style={styles.quantityControl}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.qtyBtn}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span style={styles.qtyValue}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.qtyBtn}
                        disabled={item.quantity >= item.product.stockQty}
                      >
                        +
                      </button>
                    </div>
                    <p style={styles.stockInfo}>
                      {item.product.stockQty} available
                    </p>
                  </div>

                  {/* Subtotal */}
                  <div style={styles.subtotalSection}>
                    <p style={styles.subtotal}>
                      Rs. {(Number(item.product.price) * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={styles.removeBtn}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={styles.summarySection}>
              <div style={styles.summaryCard}>
                <h2 style={styles.summaryTitle}>Order Summary</h2>
                
                <div style={styles.summaryRow}>
                  <span>Items ({cartItems.length})</span>
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

                <button
                  onClick={() => navigate('/checkout')}
                  style={styles.checkoutBtn}
                >
                  Proceed to Checkout
                </button>

                <Link to="/products" style={styles.continueLink}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
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
  emptyCart: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 60, textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  shopBtn: {
    display: 'inline-block', backgroundColor: '#E65C00',
    color: 'white', padding: '12px 28px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700',
  },
  cartLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 24,
    alignItems: 'start',
  },
  itemsSection: {
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  cartItem: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 20, display: 'grid',
    gridTemplateColumns: '80px 1fr auto auto',
    gap: 20, alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  itemImage: {
    width: 80, height: 80, backgroundColor: '#f8f8f8',
    borderRadius: 8, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: 4 },
  itemName: {
    fontSize: 16, fontWeight: '700', color: '#1a1a2e',
    textDecoration: 'none', margin: 0,
  },
  itemCategory: {
    fontSize: 12, color: '#E65C00',
    backgroundColor: '#fff3e0',
    padding: '2px 8px', borderRadius: 10,
    display: 'inline-block', width: 'fit-content',
  },
  itemPrice: {
    fontSize: 18, fontWeight: '800', color: '#E65C00',
    margin: '4px 0 0 0',
  },
  quantitySection: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 8,
  },
  quantityControl: {
    display: 'flex', alignItems: 'center',
    border: '2px solid #e0e0e0', borderRadius: 8,
  },
  qtyBtn: {
    width: 36, height: 36, backgroundColor: '#f5f5f5',
    border: 'none', fontSize: 18, cursor: 'pointer',
    fontWeight: 'bold', color: '#333',
  },
  qtyValue: {
    width: 40, textAlign: 'center',
    fontSize: 16, fontWeight: '700',
  },
  stockInfo: {
    fontSize: 12, color: '#999', margin: 0,
  },
  subtotalSection: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'flex-end', gap: 8,
  },
  subtotal: {
    fontSize: 20, fontWeight: '800', color: '#1a1a2e',
    margin: 0,
  },
  removeBtn: {
    backgroundColor: 'transparent',
    color: '#c62828', border: 'none',
    cursor: 'pointer', fontSize: 13, fontWeight: '600',
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
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 15, marginBottom: 12,
  },
  divider: {
    border: 'none', borderTop: '1px solid #f0f0f0',
    margin: '16px 0',
  },
  totalRow: {
    fontSize: 20, fontWeight: '800', color: '#1a1a2e',
  },
  checkoutBtn: {
    width: '100%', padding: 14, marginTop: 20,
    backgroundColor: '#E65C00', color: 'white',
    border: 'none', borderRadius: 8, cursor: 'pointer',
    fontSize: 16, fontWeight: '700',
  },
  continueLink: {
    display: 'block', textAlign: 'center',
    color: '#E65C00', textDecoration: 'none',
    marginTop: 16, fontSize: 14, fontWeight: '600',
  },
};
