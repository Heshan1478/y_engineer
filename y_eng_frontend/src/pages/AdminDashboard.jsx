// src/pages/AdminDashboard.jsx
// COMPLETE ADMIN DASHBOARD - Single File Implementation
// Features: Product Management, Order Management, Repair Management, Image Upload

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  // Products
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stockQty: '', categoryId: '', imageUrl: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Orders
  const [orders, setOrders] = useState([]);

  // Repairs
  const [repairs, setRepairs] = useState([]);
  const [repairForm, setRepairForm] = useState({ estimatedCost: '', adminNotes: '' });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'products') { fetchProducts(); fetchCategories(); }
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'repairs') fetchRepairs();
    }
  }, [isAdmin, activeTab]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      setUser(user);
      
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single();
      
      if (profile?.role !== 'admin') { navigate('/dashboard'); return; }
      setIsAdmin(true);
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/products`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/orders`);
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchRepairs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/repairs`);
      setRepairs(res.data);
    } catch (err) { console.error(err); }
  };

  // Product handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stockQty: parseInt(productForm.stockQty),
        category: { id: parseInt(productForm.categoryId) },
        imageUrl: productForm.imageUrl || null
      };

      if (editingProduct) {
        await axios.put(`${API_BASE}/admin/products/${editingProduct.id}`, data);
      } else {
        await axios.post(`${API_BASE}/admin/products`, data);
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', stockQty: '', categoryId: '', imageUrl: '' });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQty: product.stockQty,
      categoryId: product.category?.id || '',
      imageUrl: product.imageUrl || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setProductForm({ ...productForm, imageUrl: data.publicUrl });
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Order handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Error updating order');
    }
  };

  // Repair handlers
  const handleApproveRepair = async (repairId) => {
    const cost = prompt('Enter estimated cost (Rs):');
    const notes = prompt('Admin notes (optional):');
    if (!cost) return;

    try {
      await axios.patch(`${API_BASE}/admin/repairs/${repairId}/approve`, {
        estimatedCost: parseFloat(cost),
        adminNotes: notes || ''
      });
      fetchRepairs();
    } catch (err) {
      console.error(err);
      alert('Error approving repair');
    }
  };

  const handleRejectRepair = async (repairId) => {
    const notes = prompt('Reason for rejection:');
    if (!notes) return;

    try {
      await axios.patch(`${API_BASE}/admin/repairs/${repairId}/reject`, { adminNotes: notes });
      fetchRepairs();
    } catch (err) {
      console.error(err);
      alert('Error rejecting repair');
    }
  };

  const handleUpdateRepairStatus = async (repairId, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/admin/repairs/${repairId}/status`, { status: newStatus });
      fetchRepairs();
    } catch (err) {
      console.error(err);
      alert('Error updating repair');
    }
  };

  if (loading) return <div style={s.centered}><h2>Loading...</h2></div>;
  if (!isAdmin) return null;

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div><h1 style={s.title}>🏪 Admin Dashboard</h1><p style={s.subtitle}>{user?.email}</p></div>
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} style={s.logoutBtn}>Logout</button>
        </div>

        <div style={s.tabNav}>
          {['products', 'orders', 'repairs'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}>
              {tab === 'products' ? '📦 Products' : tab === 'orders' ? '📋 Orders' : '🔧 Repairs'}
            </button>
          ))}
        </div>

        <div style={s.content}>
          {activeTab === 'products' && (
            <div>
              <div style={s.sectionHeader}>
                <h2>Products Management</h2>
                <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stockQty: '', categoryId: '', imageUrl: '' }); }} style={s.addBtn}>+ Add Product</button>
              </div>

              {showProductForm && (
                <div style={s.modal} onClick={() => setShowProductForm(false)}>
                  <div style={s.modalContent} onClick={e => e.stopPropagation()}>
                    <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleProductSubmit}>
                      <input required placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} style={s.input} />
                      <textarea placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} style={s.textarea} rows={3} />
                      <input required type="number" step="0.01" placeholder="Price" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} style={s.input} />
                      <input required type="number" placeholder="Stock Quantity" value={productForm.stockQty} onChange={e => setProductForm({ ...productForm, stockQty: e.target.value })} style={s.input} />
                      <select required value={productForm.categoryId} onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })} style={s.input}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      
                      <div style={s.imageSection}>
                        <label style={s.label}>Product Image:</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={s.fileInput} />
                        {uploadingImage && <p>Uploading...</p>}
                        {productForm.imageUrl && <img src={productForm.imageUrl} alt="Preview" style={s.imagePreview} />}
                      </div>

                      <div style={s.modalActions}>
                        <button type="button" onClick={() => setShowProductForm(false)} style={s.cancelBtn}>Cancel</button>
                        <button type="submit" style={s.saveBtn}>{editingProduct ? 'Update' : 'Create'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div style={s.grid}>
                {products.map(p => (
                  <div key={p.id} style={s.card}>
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={s.productImage} /> : <div style={s.placeholderImage}>📦</div>}
                    <h4 style={s.cardTitle}>{p.name}</h4>
                    <p style={s.cardPrice}>Rs. {Number(p.price).toLocaleString()}</p>
                    <p style={s.cardStock}>Stock: {p.stockQty}</p>
                    <p style={s.cardCategory}>{p.category?.name || 'No category'}</p>
                    <div style={s.cardActions}>
                      <button onClick={() => handleEditProduct(p)} style={s.editBtn}>Edit</button>
                      <button onClick={() => handleDeleteProduct(p.id)} style={s.deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2>Orders Management</h2>
              <div style={s.list}>
                {orders.map(o => (
                  <div key={o.id} style={s.orderCard}>
                    <div style={s.orderHeader}>
                      <div><h4>Order #{o.orderNumber}</h4><p>{new Date(o.createdAt).toLocaleDateString()}</p></div>
                      <select value={o.status} onChange={e => handleUpdateOrderStatus(o.id, e.target.value)} style={s.statusSelect}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                    <p><strong>Customer:</strong> {o.customerName} - {o.customerPhone}</p>
                    <p><strong>Address:</strong> {o.shippingAddress}</p>
                    <p><strong>Payment:</strong> {o.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                    <p><strong>Total:</strong> Rs. {Number(o.totalAmount).toLocaleString()}</p>
                    {o.items && o.items.length > 0 && (
                      <div style={s.orderItems}>
                        <strong>Items:</strong>
                        {o.items.map((item, i) => <div key={i}>{item.productName} x {item.quantity} - Rs. {Number(item.priceAtPurchase * item.quantity).toLocaleString()}</div>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'repairs' && (
            <div>
              <h2>Repair Requests Management</h2>
              <div style={s.list}>
                {repairs.map(r => (
                  <div key={r.id} style={s.repairCard}>
                    <div style={s.repairHeader}>
                      <div><h4>{r.equipmentType} {r.brand && `- ${r.brand}`}</h4><p>Submitted: {new Date(r.createdAt).toLocaleDateString()}</p></div>
                      <span style={s.statusBadge}>{r.status}</span>
                    </div>
                    <p><strong>Customer:</strong> {r.customerName} - {r.customerPhone}</p>
                    <p><strong>Issue:</strong> {r.issueDescription}</p>
                    <p><strong>Urgency:</strong> {r.urgency} | <strong>Type:</strong> {r.serviceType}</p>
                    {r.pickupAddress && <p><strong>Pickup:</strong> {r.pickupAddress}</p>}
                    {r.estimatedCost && <p><strong>Estimated Cost:</strong> Rs. {Number(r.estimatedCost).toLocaleString()}</p>}
                    {r.adminNotes && <p style={s.adminNotes}><strong>Admin Notes:</strong> {r.adminNotes}</p>}
                    
                    <div style={s.repairActions}>
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => handleApproveRepair(r.id)} style={s.approveBtn}>✓ Approve</button>
                          <button onClick={() => handleRejectRepair(r.id)} style={s.rejectBtn}>✗ Reject</button>
                        </>
                      )}
                      {r.status === 'approved' && <button onClick={() => handleUpdateRepairStatus(r.id, 'in_progress')} style={s.progressBtn}>Start Work</button>}
                      {r.status === 'in_progress' && <button onClick={() => handleUpdateRepairStatus(r.id, 'ready')} style={s.readyBtn}>Mark Ready</button>}
                      {r.status === 'ready' && <button onClick={() => handleUpdateRepairStatus(r.id, 'completed')} style={s.completeBtn}>Complete</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' },
  container: { maxWidth: 1400, margin: '0 auto' },
  centered: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, backgroundColor: 'white', padding: 20, borderRadius: 8 },
  title: { fontSize: 28, fontWeight: '800', margin: 0 },
  subtitle: { fontSize: 14, color: '#666', margin: '4px 0 0 0' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  tabNav: { display: 'flex', gap: 8, marginBottom: 20, backgroundColor: 'white', padding: '8px', borderRadius: 8 },
  tab: { padding: '12px 24px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: 6, fontWeight: '600', fontSize: 15 },
  tabActive: { backgroundColor: '#E65C00', color: 'white' },
  content: { backgroundColor: 'white', padding: 24, borderRadius: 8, minHeight: 500 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  addBtn: { padding: '10px 20px', backgroundColor: '#E65C00', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 },
  card: { border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, backgroundColor: '#fafafa' },
  productImage: { width: '100%', height: 150, objectFit: 'cover', borderRadius: 6, marginBottom: 12 },
  placeholderImage: { width: '100%', height: 150, backgroundColor: '#e0e0e0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', margin: '0 0 8px 0' },
  cardPrice: { fontSize: 18, fontWeight: '800', color: '#E65C00', margin: '0 0 4px 0' },
  cardStock: { fontSize: 13, color: '#666', margin: '0 0 4px 0' },
  cardCategory: { fontSize: 12, color: '#999', margin: '0 0 12px 0' },
  cardActions: { display: 'flex', gap: 8 },
  editBtn: { flex: 1, padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: '600' },
  deleteBtn: { flex: 1, padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: '600' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: 30, borderRadius: 12, maxWidth: 500, width: '90%', maxHeight: '90vh', overflow: 'auto' },
  input: { width: '100%', padding: '10px', marginBottom: 12, border: '2px solid #e0e0e0', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', marginBottom: 12, border: '2px solid #e0e0e0', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' },
  imageSection: { marginBottom: 16 },
  label: { display: 'block', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  fileInput: { marginBottom: 12 },
  imagePreview: { width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 6, border: '1px solid #e0e0e0' },
  modalActions: { display: 'flex', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, padding: '10px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  saveBtn: { flex: 1, padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  orderCard: { border: '1px solid #e0e0e0', borderRadius: 8, padding: 20, backgroundColor: '#fafafa' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e0e0e0' },
  statusSelect: { padding: '6px 12px', border: '2px solid #e0e0e0', borderRadius: 6, fontSize: 14, fontWeight: '600', cursor: 'pointer' },
  orderItems: { marginTop: 12, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 6, fontSize: 13 },
  repairCard: { border: '1px solid #e0e0e0', borderRadius: 8, padding: 20, backgroundColor: '#fafafa' },
  repairHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  statusBadge: { padding: '4px 12px', backgroundColor: '#FF9800', color: 'white', borderRadius: 12, fontSize: 12, fontWeight: '600' },
  adminNotes: { backgroundColor: '#fff3e0', padding: 12, borderRadius: 6, marginTop: 8 },
  repairActions: { display: 'flex', gap: 8, marginTop: 16 },
  approveBtn: { padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  rejectBtn: { padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  progressBtn: { padding: '8px 16px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  readyBtn: { padding: '8px 16px', backgroundColor: '#00BCD4', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
  completeBtn: { padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' },
};
