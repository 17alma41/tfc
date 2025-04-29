import axios from 'axios';
const api = axios.create({
  baseURL: '/api/users',
  withCredentials: true
});

export const getAllUsers = () => api.get('/');
export const getWorkers  = () => api.get('/workers');
export const createUser  = data => api.post('/', data);
export const updateUser  = (id, data) => api.put(`/${id}`, data);
export const deleteUser  = id => api.delete(`/${id}`);
export const getUserReservations = id => api.get(`/${id}/reservations`);
export const getPublicWorkers = () => api.get('/public-workers');
