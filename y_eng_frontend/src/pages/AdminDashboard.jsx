// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { productAPI, categoryAPI, orderAPI, repairAPI } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = profile?.role || 'customer';

      console.log('🔐 Admin check - Role:', role);

      if (role !== 'admin') {
        console.log('❌ Not an admin, redirecting to dashboard...');
        navigate('/dashboard');
        return;
      }

      console.log('✅ Admin access granted!');
      setUser(user);
      setUserRole(role);
    } catch (err) {
      console.error('Error checking admin access:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🏪 Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage products, orders & repair requests</p>
          </div>
          <div style={styles.adminBadge}>
            👤 Admin: {user?.email}
          </div>
        </div>

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('products')}
            style={{...styles.tab, ...(activeTab === 'products' ? styles.activeTab : {})}}
          >
            📦 Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{...styles.tab, ...(activeTab === 'orders' ? styles.activeTab : {})}}
          >
            📋 Orders
          </button>
          <button
            onClick={() => setActiveTab('repairs')}
            style={{...styles.tab, ...(activeTab === 'repairs' ? styles.activeTab : {})}}
          >
            🔧 Repairs
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'repairs' && <RepairsTab />}
        </div>
      </div>
    </div>
  );
}

// PRODUCTS TAB
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      fetchData();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  if (loading) return <div style={styles.centered}>Loading products...</div>;

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>All Products ({products.length})</h2>
        <button onClick={() => setShowAddForm(true)} style={styles.addBtn}>
          + Add New Product
        </button>
      </div>

      {(showAddForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setShowAddForm(false);
            setEditingProduct(null);
            fetchData();
          }}
        />
      )}

      <div style={styles.table}>
        {products.length === 0 ? (
          <div style={styles.emptyState}>No products yet. Add your first product!</div>
        ) : (
          products.map((product) => (
            <div key={product.id} style={styles.productRow}>
              <div style={styles.productImage}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={styles.productImg} />
                ) : (
                  <span style={{ fontSize: 40 }}>📦</span>
                )}
              </div>
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productCategory}>{product.category?.name || 'No category'}</p>
                <p style={styles.productDesc}>{product.description}</p>
              </div>
              <div style={styles.productStats}>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Price:</span>
                  <span style={styles.statValue}>Rs. {Number(product.price).toLocaleString()}</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Stock:</span>
                  <span style={{
                    ...styles.statValue,
                    color: product.stockQty > 10 ? '#4CAF50' : product.stockQty > 0 ? '#FF9800' : '#F44336'
                  }}>
                    {product.stockQty} units
                  </span>
                </div>
              </div>
              <div style={styles.productActions}>
                <button onClick={() => setEditingProduct(product)} style={styles.editBtn}>✏️ Edit</button>
                <button onClick={() => handleDelete(product.id)} style={styles.deleteBtn}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// PRODUCT FORM
function ProductForm({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stockQty: product?.stockQty || '',
    categoryId: product?.categoryId || '',
    imageUrl: product?.imageUrl || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      console.log('No new image file, using existing URL:', form.imageUrl);
      return form.imageUrl;
    }

    console.log('📤 Uploading image...');
    setUploading(true);
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      console.log('📁 Uploading to Supabase Storage:', fileName);

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (error) {
        console.error('❌ Upload error:', error);
        throw error;
      }

      console.log('✅ Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('🔗 Public URL:', publicUrl);

      return publicUrl;
    } catch (err) {
      console.error('❌ Error uploading image:', err);
      alert('Failed to upload image: ' + err.message);
      return form.imageUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('💾 Starting save process...');
    
    try {
      const imageUrl = await uploadImage();
      
      console.log('🖼️ Image URL to save:', imageUrl);

      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stockQty: parseInt(form.stockQty),
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        imageUrl: imageUrl || null,
      };

      console.log('📦 Product data to save:', productData);

      if (product) {
        console.log('🔄 Updating product ID:', product.id);
        await productAPI.update(product.id, productData);
        console.log('✅ Product updated successfully!');
      } else {
        console.log('➕ Creating new product...');
        await productAPI.create(productData);
        console.log('✅ Product created successfully!');
      }

      alert('Product saved successfully! ✅');
      onSave();
    } catch (err) {
      console.error('❌ Error saving product:', err);
      alert('Failed to save product: ' + err.message);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Image</label>
            <div style={styles.imageUpload}>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={styles.imagePreviewLarge} />
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
              <p style={styles.hint}>Choose an image (JPG, PNG, WebP)</p>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g., Water Motor 1HP" style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product details..." rows={4} style={styles.textarea} />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (Rs.) *</label>
              <input name="price" type="number" required value={form.price} onChange={handleChange} placeholder="5000" style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Stock Quantity *</label>
              <input name="stockQty" type="number" required value={form.stockQty} onChange={handleChange} placeholder="10" style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} style={styles.select}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.formActions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={uploading} style={styles.saveBtn}>
              {uploading ? 'Uploading...' : product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ORDERS TAB
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      confirmed: '#2196F3',
      processing: '#9C27B0',
      shipped: '#00BCD4',
      delivered: '#4CAF50',
      cancelled: '#F44336',
    };
    return colors[status] || '#999';
  };

  if (loading) return <div style={styles.centered}>Loading orders...</div>;

  return (
    <div>
      <h2 style={styles.sectionTitle}>All Orders ({orders.length})</h2>
      
      <div style={styles.table}>
        {orders.length === 0 ? (
          <div style={styles.emptyState}>No orders yet</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={styles.orderNumber}>Order #{order.orderNumber}</h3>
                  <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: `${getStatusColor(order.status)}22`,
                  color: getStatusColor(order.status),
                }}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div style={styles.orderDetails}>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.customerPhone}</p>
                <p><strong>Total:</strong> Rs. {Number(order.totalAmount).toLocaleString()}</p>
                <p><strong>Payment:</strong> {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
              </div>

              {order.items && order.items.length > 0 && (
                <div style={styles.orderItems}>
                  <strong>Items:</strong>
                  {order.items.map((item) => (
                    <div key={item.id} style={styles.orderItem}>
                      • {item.productName} x {item.quantity} - Rs. {(Number(item.priceAtPurchase) * item.quantity).toLocaleString()}
                    </div>
                  ))}
                </div>
              )}

              <div style={styles.statusButtons}>
                <button onClick={() => updateStatus(order.id, 'confirmed')} style={styles.statusBtn}>Confirm</button>
                <button onClick={() => updateStatus(order.id, 'processing')} style={styles.statusBtn}>Process</button>
                <button onClick={() => updateStatus(order.id, 'shipped')} style={styles.statusBtn}>Ship</button>
                <button onClick={() => updateStatus(order.id, 'delivered')} style={styles.statusBtn}>Deliver</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// REPAIRS TAB  
function RepairsTab() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const response = await repairAPI.getAll();
      setRepairs(response.data);
    } catch (err) {
      console.error('Error fetching repairs:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (repairId, newStatus, adminNotes = '') => {
    try {
      await repairAPI.updateStatus(repairId, newStatus, adminNotes);
      fetchRepairs();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleApprove = (repairId) => {
    const cost = prompt('Enter estimated cost (Rs.):');
    if (cost) {
      updateStatus(repairId, 'approved', `Estimated cost: Rs. ${cost}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      approved: '#2196F3',
      rejected: '#F44336',
      in_progress: '#9C27B0',
      ready: '#4CAF50',
      completed: '#4CAF50',
    };
    return colors[status] || '#999';
  };

  if (loading) return <div style={styles.centered}>Loading repairs...</div>;

  return (
    <div>
      <h2 style={styles.sectionTitle}>All Repair Requests ({repairs.length})</h2>
      
      <div style={styles.table}>
        {repairs.length === 0 ? (
          <div style={styles.emptyState}>No repair requests yet</div>
        ) : (
          repairs.map((repair) => (
            <div key={repair.id} style={styles.repairCard}>
              <div style={styles.repairHeader}>
                <div>
                  <h3 style={styles.repairTitle}>{repair.equipmentType}</h3>
                  <p style={styles.repairBrand}>{repair.brand || 'No brand specified'}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: `${getStatusColor(repair.status)}22`,
                  color: getStatusColor(repair.status),
                }}>
                  {repair.status.toUpperCase()}
                </span>
              </div>

              <div style={styles.repairDetails}>
                <p><strong>Customer:</strong> {repair.customerName}</p>
                <p><strong>Phone:</strong> {repair.customerPhone}</p>
                <p><strong>Issue:</strong> {repair.issueDescription}</p>
                <p><strong>Service:</strong> {repair.serviceType === 'pickup' ? 'Pickup' : 'Drop-off'}</p>
                <p><strong>Urgency:</strong> {repair.urgency}</p>
              </div>

              {repair.adminNotes && (
                <div style={styles.adminNotesBox}>
                  <strong>Admin Notes:</strong> {repair.adminNotes}
                </div>
              )}

              <div style={styles.statusButtons}>
                <button onClick={() => handleApprove(repair.id)} style={styles.approveBtn}>Approve</button>
                <button onClick={() => updateStatus(repair.id, 'rejected', 'Request rejected')} style={styles.rejectBtn}>Reject</button>
                <button onClick={() => updateStatus(repair.id, 'in_progress')} style={styles.statusBtn}>In Progress</button>
                <button onClick={() => updateStatus(repair.id, 'ready')} style={styles.statusBtn}>Ready</button>
                <button onClick={() => updateStatus(repair.id, 'completed')} style={styles.statusBtn}>Complete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { backgroundColor: '#f8f8f8', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif" },
  container: { maxWidth: 1400, margin: '0 auto' },
  centered: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px 0' },
  subtitle: { fontSize: 16, color: '#666', margin: 0 },
  adminBadge: { backgroundColor: '#E65C00', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: '600' },
  tabs: { display: 'flex', gap: 8, marginBottom: 32, borderBottom: '2px solid #e0e0e0' },
  tab: { padding: '12px 24px', fontSize: 15, fontWeight: '600', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', cursor: 'pointer', color: '#666' },
  activeTab: { color: '#E65C00', borderBottomColor: '#E65C00' },
  tabContent: { minHeight: 400 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a2e', margin: 0 },
  addBtn: { backgroundColor: '#4CAF50', color: 'white', padding: '12px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: '700' },
  table: { display: 'flex', flexDirection: 'column', gap: 16 },
  emptyState: { backgroundColor: 'white', borderRadius: 12, padding: 60, textAlign: 'center', color: '#999' },
  productRow: { backgroundColor: 'white', borderRadius: 12, padding: 20, display: 'grid', gridTemplateColumns: '100px 1fr auto auto', gap: 20, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  productImage: { width: 100, height: 100, backgroundColor: '#f8f8f8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' },
  productInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px 0' },
  productCategory: { fontSize: 12, color: '#E65C00', backgroundColor: '#fff3e0', padding: '2px 8px', borderRadius: 10, display: 'inline-block', margin: '0 0 8px 0' },
  productDesc: { fontSize: 14, color: '#666', margin: 0 },
  productStats: { display: 'flex', flexDirection: 'column', gap: 8 },
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  statLabel: { fontSize: 12, color: '#999' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  productActions: { display: 'flex', flexDirection: 'column', gap: 8 },
  editBtn: { backgroundColor: '#2196F3', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: '600' },
  deleteBtn: { backgroundColor: '#F44336', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: '600' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', borderRadius: 12, width: '90%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottom: '1px solid #e0e0e0' },
  closeBtn: { backgroundColor: 'transparent', border: 'none', fontSize: 32, cursor: 'pointer', color: '#999' },
  form: { padding: 24 },
  formGroup: { marginBottom: 20 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  label: { display: 'block', fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8 },
  input: { width: '100%', padding: '12px', fontSize: 15, border: '2px solid #e0e0e0', borderRadius: 8, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px', fontSize: 15, border: '2px solid #e0e0e0', borderRadius: 8, boxSizing: 'border-box', resize: 'vertical' },
  select: { width: '100%', padding: '12px', fontSize: 15, border: '2px solid #e0e0e0', borderRadius: 8, boxSizing: 'border-box' },
  imageUpload: { border: '2px dashed #e0e0e0', borderRadius: 8, padding: 20, textAlign: 'center' },
  imagePreviewLarge: { maxWidth: '100%', maxHeight: 200, marginBottom: 12, borderRadius: 8 },
  fileInput: { marginBottom: 8 },
  hint: { fontSize: 12, color: '#999', margin: 0 },
  formActions: { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 },
  cancelBtn: { padding: '12px 24px', fontSize: 15, backgroundColor: '#f5f5f5', color: '#333', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '600' },
  saveBtn: { padding: '12px 24px', fontSize: 15, backgroundColor: '#E65C00', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '700' },
  orderCard: { backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' },
  orderNumber: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px 0' },
  orderDate: { fontSize: 13, color: '#999', margin: 0 },
  statusBadge: { padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: '700' },
  orderDetails: { marginBottom: 16, fontSize: 14, lineHeight: 1.8 },
  orderItems: { backgroundColor: '#f8f8f8', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 },
  orderItem: { padding: '4px 0' },
  statusButtons: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  statusBtn: { padding: '8px 16px', fontSize: 13, backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  approveBtn: { padding: '8px 16px', fontSize: 13, backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  rejectBtn: { padding: '8px 16px', fontSize: 13, backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  repairCard: { backgroundColor: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  repairHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  repairTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px 0' },
  repairBrand: { fontSize: 14, color: '#888', margin: 0 },
  repairDetails: { marginBottom: 16, fontSize: 14, lineHeight: 1.8 },
  adminNotesBox: { backgroundColor: '#fff3e0', color: '#E65C00', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 },
};