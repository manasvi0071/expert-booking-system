import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingsByEmail } from '../services/api';

const statusColors = {
  Pending: { background: '#fef3c7', color: '#92400e' },
  Confirmed: { background: '#d1fae5', color: '#065f46' },
  Completed: { background: '#e0e7ff', color: '#3730a3' },
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await getBookingsByEmail(email);
      setBookings(res.data);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>← Back</button>
        <h2 style={styles.title}>My Bookings</h2>
      </div>

      <div style={styles.searchCard}>
        <p style={styles.searchLabel}>Enter your email to view your bookings</p>
        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="your@email.com"
            style={styles.input}
          />
          <button type="submit" style={styles.searchBtn} disabled={loading}>
            {loading ? 'Searching...' : 'Find Bookings'}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {searched && (
        <>
          {bookings.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyIcon}>📭</p>
              <p style={styles.emptyText}>No bookings found for this email.</p>
              <button onClick={() => navigate('/')} style={styles.browseBtn}>Browse Experts</button>
            </div>
          ) : (
            <>
              <p style={styles.count}>{bookings.length} booking(s) found</p>
              {bookings.map(booking => (
                <div key={booking._id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.avatar}>
                      {booking.expertId?.name?.charAt(0) || 'E'}
                    </div>
                    <div style={styles.cardInfo}>
                      <h3 style={styles.expertName}>
                        {booking.expertId?.name || 'Expert'}
                      </h3>
                      <p style={styles.expertCat}>
                        {booking.expertId?.category || ''}
                      </p>
                    </div>
                    <span style={{ ...styles.statusBadge, ...statusColors[booking.status] }}>
                      {booking.status}
                    </span>
                  </div>
                  <div style={styles.cardDetails}>
                    <div style={styles.detail}>
                      <span style={styles.detailIcon}>📅</span>
                      <span>{booking.date}</span>
                    </div>
                    <div style={styles.detail}>
                      <span style={styles.detailIcon}>🕐</span>
                      <span>{booking.timeSlot}</span>
                    </div>
                    <div style={styles.detail}>
                      <span style={styles.detailIcon}>👤</span>
                      <span>{booking.name}</span>
                    </div>
                    <div style={styles.detail}>
                      <span style={styles.detailIcon}>📞</span>
                      <span>{booking.phone}</span>
                    </div>
                  </div>
                  {booking.notes && (
                    <div style={styles.notes}>
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}
                  <div style={styles.bookingId}>
                    Booking ID: {booking._id}
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 },
  backBtn: { background: 'none', border: '1px solid #4f46e5', color: '#4f46e5', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e1b4b', margin: 0 },
  searchCard: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 24 },
  searchLabel: { color: '#6b7280', marginBottom: 12 },
  searchRow: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15 },
  searchBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 500 },
  error: { color: '#ef4444', fontSize: 13, marginTop: 8 },
  count: { color: '#6b7280', fontSize: 14, marginBottom: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 16 },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardInfo: { flex: 1 },
  expertName: { fontSize: 16, fontWeight: 'bold', color: '#1e1b4b', margin: 0 },
  expertCat: { color: '#6b7280', fontSize: 13, margin: 0 },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500 },
  cardDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 },
  detail: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' },
  detailIcon: { fontSize: 16 },
  notes: { background: '#f9fafb', padding: 12, borderRadius: 8, fontSize: 14, color: '#374151', marginBottom: 8 },
  bookingId: { fontSize: 11, color: '#9ca3af' },
  emptyBox: { textAlign: 'center', padding: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyText: { color: '#6b7280', fontSize: 16, marginBottom: 16 },
  browseBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer' },
};