import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/services`,
  withCredentials: true,
});

export const createService = (data) => api.post('/', data);
export const getServices = () => api.get('/');
export const updateService = (id, data) => api.put(`/${id}`, data);
export const deleteService = (id) => api.delete(`/${id}`);