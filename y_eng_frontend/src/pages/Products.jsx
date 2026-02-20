// src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products. Make sure backend is running on port 8080.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filterByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      if (categoryId === null) {
        await fetchProducts();
      } else {
        const response = await productAPI.getByCategory(categoryId);
        setProducts(response.data);
      }
    } catch (err) {
      setError('Failed to filter products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await productAPI.search(query);
        setProducts(response.data);
      } catch (err) {
        console.error('Search error:', err);
      }
    } else if (query.length === 0) {
      fetchProducts();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Our Products</h1>

      {/* Search Bar */}
      <div style={styles.searchRow}>
        <input
          type="text"
          placeholder="🔍  Search products..."
          value={searchQuery}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {/* Category Filter */}
      <div style={styles.filterRow}>
        <button
          onClick={() => filterByCategory(null)}
          style={{
            ...styles.filterBtn,
            backgroundColor: selectedCategory === null ? '#e65c00' : '#f0f0f0',
            color: selectedCategory === null ? 'white' : '#333',
          }}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => filterByCategory(category.id)}
            style={{
              ...styles.filterBtn,
              backgroundColor: selectedCategory === category.id ? '#e65c00' : '#f0f0f0',
              color: selectedCategory === category.id ? 'white' : '#333',
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>{error}</div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: 40 }}>📦</p>
          <h3>No products found</h3>
          <p style={{ color: '#999' }}>Try a different search or category</p>
        </div>
      ) : (
        <>
          <p style={styles.resultCount}>{products.length} products found</p>
          <div style={styles.grid}>
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                style={styles.card}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                {/* Product Image - UPDATED */}
                <div style={styles.imageContainer}>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      style={styles.productImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{
                    ...styles.placeholderIcon,
                    display: product.imageUrl ? 'none' : 'flex'
                  }}>
                    ⚙️
                  </div>
                </div>

                {/* Category Tag */}
                {product.category && (
                  <span style={styles.categoryTag}>{product.category.name}</span>
                )}

                {/* Product Info */}
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productDesc}>
                  {product.description
                    ? product.description.length > 60
                      ? product.description.substring(0, 60) + '...'
                      : product.description
                    : 'Click to view details'}
                </p>

                {/* Price & Stock */}
                <div style={styles.bottomRow}>
                  <span style={styles.price}>
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                  <span style={{
                    ...styles.stockBadge,
                    backgroundColor: product.stockQty > 0 ? '#e8f5e9' : '#fce4ec',
                    color: product.stockQty > 0 ? '#2e7d32' : '#c62828',
                  }}>
                    {product.stockQty > 0 ? `In Stock` : 'Out of Stock'}
                  </span>
                </div>

                {/* View Details hint */}
                <div style={styles.viewDetails}>
                  View Details →
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  searchRow: {
    marginBottom: 16,
  },
  searchInput: {
    width: '100%',
    maxWidth: 440,
    padding: '12px 16px',
    fontSize: 15,
    border: '2px solid #e0e0e0',
    borderRadius: 8,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  filterRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  filterBtn: {
    padding: '8px 18px',
    border: 'none',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  errorBox: {
    padding: 16,
    backgroundColor: '#fce4ec',
    color: '#c62828',
    borderRadius: 8,
    marginBottom: 20,
    fontWeight: '500',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#555',
  },
  resultCount: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #f0f0f0',
  },
  
  // ── IMAGE STYLES (NEW) ──
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderIcon: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  
  categoryTag: {
    display: 'inline-block',
    backgroundColor: '#fff3e0',
    color: '#e65c00',
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 6px 0',
  },
  productDesc: {
    fontSize: 13,
    color: '#888',
    margin: '0 0 14px 0',
    lineHeight: 1.5,
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e65c00',
  },
  stockBadge: {
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  viewDetails: {
    fontSize: 13,
    color: '#e65c00',
    fontWeight: '600',
    textAlign: 'right',
  },
};