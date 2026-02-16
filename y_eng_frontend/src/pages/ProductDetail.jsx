// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../services/api';

export default function ProductDetail({ user }) {
  const { id } = useParams();                        //geting product id from url (/product/5)
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartMsg, setCartMsg] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);   //get single product
      setProduct(response.data);
      setError('');
    } catch (err) {
      setError('Product not found.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {                 //add to cart logic
    // If not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
    setCartMsg(`✅ ${quantity} x "${product.name}" added to cart!`);
    // TODO: Implement actual cart logic later
    setTimeout(() => setCartMsg(''), 3000);
  };

  const handleQuantityChange = (change) => {    //quantity control
    const newQty = quantity + change;
    if (newQty < 1) return;
    if (newQty > product.stockQty) return;
    setQuantity(newQty);
  };

  // ── Loading State ──────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={{ color: '#888', marginTop: 16 }}>Loading product...</p>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────
  if (error || !product) {
    return (
      <div style={styles.centered}>
        <p style={{ fontSize: 48 }}>⚠️</p>
        <h2 style={{ color: '#333' }}>Product Not Found</h2>
        <p style={{ color: '#888' }}>
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate('/products')} style={styles.backBtn}>
          ← Back to Products
        </button>
      </div>
    );
  }

  const inStock = product.stockQty > 0;

  // ── Main Render ────────────────────────────────────────────
  return (
    <div style={styles.page}>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link to="/products" style={styles.breadcrumbLink}>Products</Link>
        <span style={{ color: '#999', margin: '0 8px' }}>›</span>
        <span style={{ color: '#333' }}>{product.name}</span>
      </div>

      {/* Main Content Card */}
      <div style={styles.card}>

        {/* LEFT: Image */}
        <div style={styles.imageSection}>
          <div style={styles.imagePlaceholder}>
            <span style={styles.imageIcon}>⚙️</span>
            <p style={{ color: '#aaa', marginTop: 8, fontSize: 14 }}>Product Image</p>
          </div>
          {/* Stock badge on image */}
          <div style={{
            ...styles.stockBadge,
            backgroundColor: inStock ? '#e8f5e9' : '#fce4ec',
            color: inStock ? '#2e7d32' : '#c62828',
          }}>
            {inStock ? `✓ In Stock` : '✗ Out of Stock'}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div style={styles.detailsSection}>

          {/* Category tag */}
          {product.category && (
            <span style={styles.categoryTag}>
              {product.category.name}
            </span>
          )}

          {/* Product Name */}
          <h1 style={styles.productName}>{product.name}</h1>

          {/* Price */}
          <div style={styles.priceRow}>
            <span style={styles.price}>Rs. {Number(product.price).toLocaleString()}</span>
            <span style={styles.tax}>incl. tax</span>
          </div>

          {/* Divider */}
          <hr style={styles.divider} />

          {/* Description */}
          <div style={styles.descriptionSection}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>
              {product.description || 'No description available for this product.'}
            </p>
          </div>

          {/* Divider */}
          <hr style={styles.divider} />

          {/* Stock Info */}
          <div style={styles.stockRow}>
            <span style={styles.sectionTitle}>Availability:</span>
            <span style={{
              color: inStock ? '#2e7d32' : '#c62828',
              fontWeight: '600',
              marginLeft: 10,
            }}>
              {inStock
                ? `${product.stockQty} units available`
                : 'Currently out of stock'}
            </span>
          </div>

          {/* Quantity Selector — only if in stock */}
          {inStock && (
            <div style={styles.quantityRow}>
              <span style={styles.sectionTitle}>Quantity:</span>
              <div style={styles.quantityControl}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  style={styles.qtyBtn}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span style={styles.qtyValue}>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  style={styles.qtyBtn}
                  disabled={quantity >= product.stockQty}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Cart Success Message */}
          {cartMsg && (
            <div style={styles.cartMsg}>
              {cartMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              style={{
                ...styles.addToCartBtn,
                backgroundColor: inStock ? '#e65c00' : '#ccc',
                cursor: inStock ? 'pointer' : 'not-allowed',
              }}
            >
              {!inStock
                ? 'Out of Stock'
                : !user
                ? '🔒 Login to Add to Cart'
                : '🛒 Add to Cart'}
            </button>

            <a
              href="https://wa.me/94763890902?text=Hi, I'm interested in: ${product.name}"
              target="_blank"
              rel="noreferrer"
              style={styles.whatsappBtn}
            >
              💬 Inquire on WhatsApp
            </a>
          </div>

          {/* Info Tags */}
          <div style={styles.infoTags}>
            <span style={styles.tag}>🚚 Fast Delivery</span>
            <span style={styles.tag}>🔧 Warranty Included</span>
            <span style={styles.tag}>📞 Expert Support</span>
          </div>

        </div>
      </div>

      {/* Back Button */}
      <button onClick={() => navigate('/products')} style={styles.backBtn}>
        ← Back to Products
      </button>

    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: 20,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #f0f0f0',
    borderTop: '4px solid #e65c00',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  breadcrumb: {
    marginBottom: 24,
    fontSize: 14,
    color: '#999',
  },
  breadcrumbLink: {
    color: '#e65c00',
    textDecoration: 'none',
    fontWeight: '500',
  },
  card: {
    display: 'flex',
    gap: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    flexWrap: 'wrap',
  },
  imageSection: {
    flex: '1 1 300px',
    minWidth: 280,
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: 320,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    border: '2px dashed #ddd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    fontSize: 80,
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '600',
  },
  detailsSection: {
    flex: '1 1 340px',
    minWidth: 300,
  },
  categoryTag: {
    display: 'inline-block',
    backgroundColor: '#fff3e0',
    color: '#e65c00',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 16px 0',
    lineHeight: 1.3,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e65c00',
  },
  tax: {
    fontSize: 13,
    color: '#999',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    margin: '20px 0',
  },
  descriptionSection: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    margin: '0 0 8px 0',
  },
  description: {
    color: '#444',
    lineHeight: 1.7,
    fontSize: 15,
    margin: 0,
  },
  stockRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#333',
  },
  qtyValue: {
    width: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  cartMsg: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px 16px',
    borderRadius: 8,
    marginBottom: 16,
    fontWeight: '600',
    fontSize: 14,
  },
  buttonGroup: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  addToCartBtn: {
    flex: '1 1 160px',
    padding: '14px 20px',
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    transition: 'opacity 0.2s',
  },
  whatsappBtn: {
    flex: '1 1 160px',
    padding: '14px 20px',
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#25D366',
    border: 'none',
    borderRadius: 8,
    textDecoration: 'none',
    textAlign: 'center',
    cursor: 'pointer',
  },
  infoTags: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f5f5f5',
    color: '#555',
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
  },
  backBtn: {
    marginTop: 24,
    backgroundColor: 'transparent',
    border: '2px solid #ddd',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    cursor: 'pointer',
    color: '#555',
    fontWeight: '600',
    display: 'inline-block',
  },
};
