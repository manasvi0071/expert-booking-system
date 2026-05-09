import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getExperts = (params) => API.get('/experts', { params });
export const getExpertById = (id) => API.get(`/experts/${id}`);
export const createBooking = (data) => API.post('/bookings', data);
export const getBookingsByEmail = (email) => API.get(`/bookings?email=${email}`);
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });