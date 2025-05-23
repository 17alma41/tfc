import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/reservations`,
  withCredentials: true,
});

export const getAvailableSlots = (workerId, date, serviceDuration) =>
  api.get('/available-slots', {
    params: { worker_id: workerId, date, service_duration: serviceDuration },
  });

export const createReservation = (data) => api.post('/', data);

export const cancelClientReservation = (id) => api.delete(`/${id}`);

export const getClientReservations = () => api.get('/client');
