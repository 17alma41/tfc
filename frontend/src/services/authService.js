import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Asegúrate que coincida con tu backend
  withCredentials: true, // 🔐 permite enviar cookies
});

export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const logout = () => api.post('/api/auth/logout');
export const getProfile = () => api.get('/api/auth/profile');
export const getWorkers = () => api.get('/api/users/workers');
