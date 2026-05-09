import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createBooking } from '../services/api';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { expert, date: preDate, timeSlot: preSlot } = location.state || {};

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    date: preDate || '', timeSlot: preSlot || '', notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Phone must be 10 digits';
    if (!form.date) errs.date = 'Date is required';
    if (!form.timeSlot) errs.timeSlot = 'Time slot is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      setLoading(true);
      setServerError('');
      await createBooking({ expertId: id, ...form });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Booking Confirmed!</h2>
          <p style={styles.successText}>Your session with <strong>{expert?.name}</strong> has been booked.</p>
          <p style={styles.successText}>📅 {form.date} at 🕐 {form.timeSlot}</p>
          <div style={styles.successBtns}>
            <button onClick={() => navigate('/')} style={styles.primaryBtn}>Browse More Experts</button>
            <button onClick={() => navigate('/my-bookings')} style={styles.secondaryBtn}>View My Bookings</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      <div style={styles.card}>
        <h2 style={styles.title}>Book a Session</h2>
        {expert && (
          <div style={styles.expertInfo}>
            <div style={styles.avatar}>{expert.name.charAt(0)}</div>
            <div>
              <p style={styles.expertName}>{expert.name}</p>
              <p style={styles.expertCat}>{expert.category}</p>
            </div>
          </div>
        )}

        {serverError && <div style={styles.errorBox}>{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="John Doe" />
            {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input name="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="john@example.com" />
            {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone *</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={styles.input} placeholder="10 digit number" />
            {errors.phone && <span style={styles.fieldError}>{errors.phone}</span>}
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Date *</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} style={styles.input} />
              {errors.date && <span style={styles.fieldError}>{errors.date}</span>}
            </div>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Time Slot *</label>
              <input name="timeSlot" value={form.timeSlot} onChange={handleChange} style={styles.input} placeholder="e.g. 10:00 AM" readOnly={!!preSlot} />
              {errors.timeSlot && <span style={styles.fieldError}>{errors.timeSlot}</span>}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Notes (Optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} style={styles.textarea} placeholder="Any specific topics you want to discuss..." />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' },
  backBtn: { background: 'none', border: '1px solid #4f46e5', color: '#4f46e5', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 24 },
  card: { background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e1b4b', marginBottom: 20 },
  expertInfo: { display: 'flex', alignItems: 'center', gap: 12, background: '#f5f3ff', padding: 16, borderRadius: 8, marginBottom: 24 },
  avatar: { width: 48, height: 48, borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  expertName: { fontWeight: 'bold', color: '#1e1b4b', margin: 0 },
  expertCat: { color: '#6b7280', fontSize: 13, margin: 0 },
  errorBox: { background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, marginBottom: 16 },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, minHeight: 100, boxSizing: 'border-box' },
  row: { display: 'flex', gap: 16 },
  fieldError: { color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' },
  submitBtn: { width: '100%', background: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 'bold', marginTop: 8 },
  successBox: { textAlign: 'center', background: '#fff', borderRadius: 12, padding: 48, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: 40 },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#065f46', marginBottom: 8 },
  successText: { color: '#374151', fontSize: 16, marginBottom: 8 },
  successBtns: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 },
  primaryBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 15 },
  secondaryBtn: { background: '#fff', color: '#4f46e5', border: '1px solid #4f46e5', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 15 },
};