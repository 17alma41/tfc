import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/services',
  withCredentials: true,
});

export const createService = (data) => api.post('/', data);
export const getServices = () => api.get('/');
export const updateService = (id, data) => api.put(`/${id}`, data);
export const deleteService = (id) => api.delete(`/${id}`);