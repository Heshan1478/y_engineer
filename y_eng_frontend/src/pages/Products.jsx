// src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products on component mount
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
      <div style={{ padding: 20 }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Our Products</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: 10,
            fontSize: 16,
            border: '1px solid #ddd',
            borderRadius: 5,
          }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => filterByCategory(null)}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedCategory === null ? '#007bff' : '#f0f0f0',
            color: selectedCategory === null ? 'white' : 'black',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => filterByCategory(category.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === category.id ? '#007bff' : '#f0f0f0',
              color: selectedCategory === category.id ? 'white' : 'black',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ padding: 15, backgroundColor: '#ffe6e6', color: '#d00', borderRadius: 5, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 15,
                backgroundColor: 'white',
              }}
            >
              {/* Product Image Placeholder */}
              <div
                style={{
                  width: '100%',
                  height: 200,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 5,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                {product.name}
              </div>

              <h3 style={{ margin: '10px 0', fontSize: 18 }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: 14, margin: '5px 0' }}>
                {product.description || 'No description available'}
              </p>
              <p style={{ fontSize: 20, fontWeight: 'bold', color: '#007bff', margin: '10px 0' }}>
                Rs. {product.price}
              </p>
              <p style={{ fontSize: 14, color: product.stockQty > 0 ? 'green' : 'red' }}>
                {product.stockQty > 0 ? `In Stock (${product.stockQty})` : 'Out of Stock'}
              </p>

              <button
                disabled={product.stockQty === 0}
                style={{
                  width: '100%',
                  padding: 10,
                  marginTop: 10,
                  backgroundColor: product.stockQty > 0 ? '#28a745' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: product.stockQty > 0 ? 'pointer' : 'not-allowed',
                  fontSize: 16,
                }}
              >
                {product.stockQty > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
