// src/pages/MyOrders.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { orderAPI } from '../services/api';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const response = await orderAPI.getByUser(user.id);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
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

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div style={ordersStyles.centered}>
        <h2>Loading orders...</h2>
      </div>
    );
  }

  return (
    <div style={ordersStyles.page}>
      <div style={ordersStyles.container}>
        <h1 style={ordersStyles.title}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={ordersStyles.emptyState}>
            <p style={{ fontSize: 64, margin: 0 }}>📦</p>
            <h2 style={{ margin: '16px 0 8px 0' }}>No orders yet</h2>
            <p style={{ color: '#999', margin: '0 0 24px 0' }}>
              Start shopping to place your first order
            </p>
            <Link to="/products" style={ordersStyles.shopBtn}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={ordersStyles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} style={ordersStyles.orderCard}>
                
                {/* Header */}
                <div style={ordersStyles.orderHeader}>
                  <div>
                    <h3 style={ordersStyles.orderNumber}>
                      Order #{order.orderNumber}
                    </h3>
                    <p style={ordersStyles.orderDate}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span 
                    style={{
                      ...ordersStyles.statusBadge,
                      backgroundColor: `${getStatusColor(order.status)}22`,
                      color: getStatusColor(order.status),
                    }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div style={ordersStyles.itemsList}>
                    {order.items.map((item) => (
                      <div key={item.id} style={ordersStyles.orderItem}>
                        <span style={ordersStyles.itemName}>
                          {item.productName} <span style={ordersStyles.itemQty}>x {item.quantity}</span>
                        </span>
                        <span style={ordersStyles.itemPrice}>
                          Rs. {(Number(item.priceAtPurchase) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={ordersStyles.orderFooter}>
                  <div>
                    <span style={ordersStyles.totalLabel}>Total: </span>
                    <span style={ordersStyles.totalAmount}>
                      Rs. {Number(order.totalAmount).toLocaleString()}
                    </span>
                  </div>
                  <div style={ordersStyles.paymentBadge}>
                    {order.paymentMethod === 'cash_on_delivery' ? '💵 Cash on Delivery' : '🏦 Bank Transfer'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ordersStyles = {
  page: {
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: { maxWidth: 900, margin: '0 auto' },
  centered: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '60vh',
  },
  title: {
    fontSize: 32, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 32px 0',
  },
  emptyState: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 60, textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  shopBtn: {
    display: 'inline-block', backgroundColor: '#E65C00',
    color: 'white', padding: '12px 28px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700',
  },
  ordersList: {
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  orderCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
  },
  orderHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 20,
    paddingBottom: 16, borderBottom: '1px solid #f0f0f0',
  },
  orderNumber: {
    fontSize: 18, fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 4px 0',
  },
  orderDate: { fontSize: 13, color: '#999', margin: 0 },
  statusBadge: {
    padding: '6px 14px', borderRadius: 20,
    fontSize: 13, fontWeight: '700',
  },
  itemsList: {
    display: 'flex', flexDirection: 'column', gap: 8,
    marginBottom: 16,
  },
  orderItem: {
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0',
  },
  itemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  itemQty: { color: '#999', fontWeight: '400' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#E65C00' },
  orderFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 16,
    borderTop: '1px solid #f0f0f0',
  },
  totalLabel: { fontSize: 14, color: '#666' },
  totalAmount: {
    fontSize: 20, fontWeight: '800', color: '#1a1a2e',
  },
  paymentBadge: {
    fontSize: 13, color: '#666',
    backgroundColor: '#f8f8f8',
    padding: '6px 12px', borderRadius: 6,
  },
};