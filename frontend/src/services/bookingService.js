import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true, 
});

export const getAvailableSlots = (worker_id, date, service_duration) => {
  return api.get('/api/reservations/available-slots', { params: { worker_id, date, service_duration } });
}

export const createReservation = (data) => api.post('/api/reservations', data);
