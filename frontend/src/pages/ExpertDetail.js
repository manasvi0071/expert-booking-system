import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpertById } from '../services/api';
import socket from '../services/socket';

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    fetchExpert();

    socket.on('slotBooked', ({ expertId, date, timeSlot }) => {
      if (expertId === id) {
        setBookedSlots(prev => [...prev, `${date}_${timeSlot}`]);
      }
    });

    return () => socket.off('slotBooked');
  }, [id]);

  const fetchExpert = async () => {
    try {
      setLoading(true);
      const res = await getExpertById(id);
      const expertData = res.data;
      
      // Safety check
      if (!expertData.availableSlots) {
        expertData.availableSlots = [];
      }
      setExpert(expertData);

      // Fetch booked slots
      try {
        const bookingsRes = await fetch(`http://localhost:5000/api/bookings/expert/${id}`);
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          const slots = data.map(b => `${b.date}_${b.timeSlot}`);
          setBookedSlots(slots);
        }
      } catch (e) {
        // ignore booked slots error
      }
    } catch (err) {
      setError('Failed to load expert details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={styles.center}>Loading...</p>;
  if (error) return <p style={styles.error}>{error}</p>;
  if (!expert) return null;

  const slots = Array.isArray(expert.availableSlots) ? expert.availableSlots : [];

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>← Back</button>

      <div style={styles.card}>
        <div style={styles.avatar}>{expert.name.charAt(0)}</div>
        <h2 style={styles.name}>{expert.name}</h2>
        <span style={styles.category}>{expert.category}</span>
        <p style={styles.bio}>{expert.bio}</p>
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <strong>{expert.experience}</strong>
            <span>Years Exp</span>
          </div>
          <div style={styles.stat}>
            <strong>{expert.rating}</strong>
            <span>Rating</span>
          </div>
        </div>
      </div>

      <h3 style={styles.slotsTitle}>Available Time Slots</h3>
      <p style={styles.liveNote}>🔴 Live — slots update in real-time</p>

      {slots.length === 0 ? (
        <p style={styles.center}>No available slots for this expert.</p>
      ) : (
        slots.map(({ date, slots: timeSlots }) => (
          <div key={date} style={styles.dateBlock}>
            <h4 style={styles.dateTitle}>📅 {date}</h4>
            <div style={styles.slotsGrid}>
              {(timeSlots || []).map(slot => {
                const isBooked = bookedSlots.includes(`${date}_${slot}`);
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => navigate(`/booking/${id}`, {
                      state: { expert, date, timeSlot: slot }
                    })}
                    style={{
                      ...styles.slotBtn,
                      ...(isBooked ? styles.bookedSlot : styles.availableSlot)
                    }}
                  >
                    {slot} {isBooked ? '✗' : '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' },
  backBtn: { background: 'none', border: '1px solid #4f46e5', color: '#4f46e5', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 24 },
  card: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1e1b4b' },
  category: { background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: 12, fontSize: 13 },
  bio: { color: '#6b7280', marginTop: 12, lineHeight: 1.6 },
  statsRow: { display: 'flex', justifyContent: 'center', gap: 40, marginTop: 16 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  slotsTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e1b4b', marginBottom: 4 },
  liveNote: { color: '#ef4444', fontSize: 13, marginBottom: 16 },
  dateBlock: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  dateTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#374151' },
  slotsGrid: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  slotBtn: { padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14 },
  availableSlot: { background: '#d1fae5', color: '#065f46', cursor: 'pointer' },
  bookedSlot: { background: '#fee2e2', color: '#991b1b', cursor: 'not-allowed', textDecoration: 'line-through' },
  center: { textAlign: 'center', color: '#6b7280', marginTop: 40 },
  error: { textAlign: 'center', color: 'red', marginTop: 40 },
};