import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true, // permite enviar cookies
});

export const register = (data) => api.post('/api/auth/register', data);

export const login = async ({ email, password }) => {
  try {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data; 
  } catch (err) {
   
    if (err.response?.data?.errors) {
      const msgs = err.response.data.errors.map(e => e.msg).join(', ');
      throw new Error(msgs);
    }
    
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw err;
  }
};

export const logout = () => api.post('/api/auth/logout');
export const getProfile = () => api.get('/api/auth/profile');
export const getWorkers = () => api.get('/api/users/workers');
