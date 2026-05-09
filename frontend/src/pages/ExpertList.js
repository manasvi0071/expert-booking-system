import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExperts } from '../services/api';

const CATEGORIES = ['All', 'Technology', 'Finance', 'Health', 'Legal'];

export default function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 4 };
      if (category && category !== 'All') params.category = category;
      if (search) params.search = search;
      const res = await getExperts(params);
      setExperts(res.data.experts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load experts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExperts();
  };

  const renderStars = (rating) => '⭐'.repeat(Math.round(rating));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Find an Expert</h1>
        <button onClick={() => navigate('/my-bookings')} style={styles.myBookingsBtn}>
          My Bookings
        </button>
      </div>

      <form onSubmit={handleSearch} style={styles.searchRow}>
        <input
          style={styles.input}
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" style={styles.searchBtn}>Search</button>
      </form>

      <div style={styles.filterRow}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
            style={{ ...styles.filterBtn, background: (category === cat || (cat === 'All' && !category)) ? '#4f46e5' : '#e5e7eb', color: (category === cat || (cat === 'All' && !category)) ? '#fff' : '#333' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p style={styles.center}>Loading experts...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {experts.map(expert => (
          <div key={expert._id} style={styles.card} onClick={() => navigate(`/expert/${expert._id}`)}>
            <div style={styles.avatar}>{expert.name.charAt(0)}</div>
            <h3 style={styles.name}>{expert.name}</h3>
            <span style={styles.category}>{expert.category}</span>
            <p style={styles.exp}>{expert.experience} years experience</p>
            <p>{renderStars(expert.rating)} {expert.rating}</p>
            <button style={styles.bookBtn}>View & Book</button>
          </div>
        ))}
      </div>

      {!loading && experts.length === 0 && <p style={styles.center}>No experts found.</p>}

      <div style={styles.pagination}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={styles.pageBtn}>← Prev</button>
        <span style={{ margin: '0 16px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={styles.pageBtn}>Next →</button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1e1b4b' },
  myBookingsBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  searchRow: { display: 'flex', gap: 8, marginBottom: 16 },
  input: { flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15 },
  searchBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' },
  filterRow: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  filterBtn: { padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' },
  avatar: { width: 60, height: 60, borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  category: { background: '#e0e7ff', color: '#4f46e5', padding: '2px 10px', borderRadius: 12, fontSize: 12 },
  exp: { color: '#6b7280', fontSize: 13, margin: '8px 0' },
  bookBtn: { marginTop: 12, background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', width: '100%' },
  center: { textAlign: 'center', color: '#6b7280' },
  error: { textAlign: 'center', color: 'red' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  pageBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer' },
};