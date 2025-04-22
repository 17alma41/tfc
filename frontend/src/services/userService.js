import axios from 'axios';

export const getAllWorkers = () =>
  axios.get('/api/users/workers', { withCredentials: true });

export const getWorkerReservations = (id) =>
  axios.get(`/api/users/${id}/reservations`, { withCredentials: true });

export const updateWorker = (id, data) =>
  axios.put(`/api/users/${id}`, data, { withCredentials: true });

export const deleteWorker = (id) =>
  axios.delete(`/api/users/${id}`, { withCredentials: true });
