// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { repairAPI } from '../services/api';

export default function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  useEffect(() => {
    fetchUserAndRepairs();
    if (successMsg) {
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  }, []);

  const fetchUserAndRepairs = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user's repair requests
        const response = await repairAPI.getByUser(user.id);
        setRepairs(response.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
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

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      in_progress: 'In Progress',
      ready: 'Ready for Pickup',
      completed: 'Completed',
    };
    return labels[status] || status;
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

        {/* Success Message */}
        {successMsg && (
          <div style={styles.successMsg}>{successMsg}</div>
        )}

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Dashboard</h1>
            <p style={styles.subtitle}>
              Welcome back, <strong>{user?.email}</strong>
            </p>
          </div>
          <Link to="/book-repair" style={styles.newRepairBtn}>
            + New Repair Request
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📋</div>
            <div style={styles.statValue}>{repairs.length}</div>
            <div style={styles.statLabel}>Total Requests</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statValue}>
              {repairs.filter(r => r.status === 'pending' || r.status === 'approved').length}
            </div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔧</div>
            <div style={styles.statValue}>
              {repairs.filter(r => r.status === 'in_progress').length}
            </div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statValue}>
              {repairs.filter(r => r.status === 'completed').length}
            </div>
            <div style={styles.statLabel}>Completed</div>
          </div>
        </div>

        {/* Repair Requests Table */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>My Repair Requests</h2>

          {repairs.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ fontSize: 48, margin: 0 }}>📦</p>
              <h3 style={{ margin: '16px 0 8px 0' }}>No repair requests yet</h3>
              <p style={{ color: '#999', margin: '0 0 24px 0' }}>
                Book your first repair service to get started
              </p>
              <Link to="/book-repair" style={styles.emptyBtn}>
                Book a Repair
              </Link>
            </div>
          ) : (
            <div style={styles.table}>
              {repairs.map((repair) => (
                <div key={repair.id} style={styles.repairCard}>
                  
                  {/* Top Row */}
                  <div style={styles.repairHeader}>
                    <div>
                      <h3 style={styles.repairTitle}>{repair.equipmentType}</h3>
                      {repair.brand && (
                        <p style={styles.repairBrand}>{repair.brand}</p>
                      )}
                    </div>
                    <span 
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: `${getStatusColor(repair.status)}22`,
                        color: getStatusColor(repair.status),
                      }}
                    >
                      {getStatusLabel(repair.status)}
                    </span>
                  </div>

                  {/* Issue Description */}
                  <p style={styles.repairDesc}>
                    {repair.issueDescription}
                  </p>

                  {/* Details Grid */}
                  <div style={styles.detailsGrid}>
                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>Service Type:</span>
                      <span style={styles.detailValue}>
                        {repair.serviceType === 'pickup' ? '📦 Pickup' : '🏪 Drop-off'}
                      </span>
                    </div>
                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>Urgency:</span>
                      <span style={styles.detailValue}>
                        {repair.urgency === 'urgent' ? '🔥 Urgent' : '⏰ Normal'}
                      </span>
                    </div>
                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>Submitted:</span>
                      <span style={styles.detailValue}>
                        {new Date(repair.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {repair.estimatedCost && (
                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Estimated Cost:</span>
                        <span style={{ ...styles.detailValue, fontWeight: '700', color: '#E65C00' }}>
                          Rs. {Number(repair.estimatedCost).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Admin Notes */}
                  {repair.adminNotes && (
                    <div style={styles.adminNotes}>
                      <strong>Admin Notes:</strong> {repair.adminNotes}
                    </div>
                  )}

                  {/* Timeline */}
                  <div style={styles.timeline}>
                    <div style={{
                      ...styles.timelineStep,
                      opacity: repair.status === 'pending' ? 1 : 0.4,
                    }}>
                      <div style={styles.timelineDot}>1</div>
                      <span>Pending</span>
                    </div>
                    <div style={styles.timelineLine} />
                    <div style={{
                      ...styles.timelineStep,
                      opacity: repair.status === 'approved' || repair.status === 'in_progress' || repair.status === 'ready' || repair.status === 'completed' ? 1 : 0.4,
                    }}>
                      <div style={styles.timelineDot}>2</div>
                      <span>Approved</span>
                    </div>
                    <div style={styles.timelineLine} />
                    <div style={{
                      ...styles.timelineStep,
                      opacity: repair.status === 'in_progress' || repair.status === 'ready' || repair.status === 'completed' ? 1 : 0.4,
                    }}>
                      <div style={styles.timelineDot}>3</div>
                      <span>In Progress</span>
                    </div>
                    <div style={styles.timelineLine} />
                    <div style={{
                      ...styles.timelineStep,
                      opacity: repair.status === 'ready' || repair.status === 'completed' ? 1 : 0.4,
                    }}>
                      <div style={styles.timelineDot}>4</div>
                      <span>Ready</span>
                    </div>
                    <div style={styles.timelineLine} />
                    <div style={{
                      ...styles.timelineStep,
                      opacity: repair.status === 'completed' ? 1 : 0.4,
                    }}>
                      <div style={styles.timelineDot}>5</div>
                      <span>Completed</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
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
  successMsg: {
    backgroundColor: '#e8f5e9', color: '#2e7d32',
    padding: 16, borderRadius: 8, marginBottom: 24,
    fontWeight: '600', textAlign: 'center',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16,
  },
  title: {
    fontSize: 32, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 4px 0',
  },
  subtitle: { fontSize: 16, color: '#666', margin: 0 },
  newRepairBtn: {
    display: 'inline-block', backgroundColor: '#E65C00',
    color: 'white', padding: '12px 24px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700', fontSize: 15,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 20, marginBottom: 40,
  },
  statCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 24, textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  statIcon: { fontSize: 32, marginBottom: 12 },
  statValue: {
    fontSize: 32, fontWeight: '900', color: '#E65C00',
    margin: '0 0 4px 0',
  },
  statLabel: { fontSize: 13, color: '#888' },
  section: { marginBottom: 40 },
  sectionTitle: {
    fontSize: 24, fontWeight: '800', color: '#1a1a2e',
    margin: '0 0 24px 0',
  },
  emptyState: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 60, textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  emptyBtn: {
    display: 'inline-block', backgroundColor: '#E65C00',
    color: 'white', padding: '12px 28px', borderRadius: 8,
    textDecoration: 'none', fontWeight: '700',
  },
  table: { display: 'flex', flexDirection: 'column', gap: 20 },
  repairCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
  },
  repairHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  repairTitle: {
    fontSize: 18, fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 4px 0',
  },
  repairBrand: {
    fontSize: 14, color: '#888', margin: 0,
  },
  statusBadge: {
    padding: '6px 14px', borderRadius: 20,
    fontSize: 13, fontWeight: '700',
  },
  repairDesc: {
    fontSize: 14, color: '#555', lineHeight: 1.7,
    margin: '0 0 16px 0',
  },
  detailsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12, marginBottom: 16,
  },
  detail: {
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  detailLabel: { fontSize: 12, color: '#999', fontWeight: '600' },
  detailValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  adminNotes: {
    backgroundColor: '#fff3e0', color: '#E65C00',
    padding: 12, borderRadius: 8, fontSize: 14,
    marginBottom: 16,
  },
  timeline: {
    display: 'flex', alignItems: 'center',
    paddingTop: 16, borderTop: '1px solid #f0f0f0',
  },
  timelineStep: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 6, fontSize: 12,
  },
  timelineDot: {
    width: 28, height: 28, borderRadius: '50%',
    backgroundColor: '#E65C00', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', fontSize: 12,
  },
  timelineLine: {
    flex: 1, height: 2, backgroundColor: '#E65C00',
  },
};
