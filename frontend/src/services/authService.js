import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  withCredentials: true,
});

const handleError = (err) => {
  if (err.response?.data?.errors) {
    const msgs = err.response.data.errors.map(e => e.msg).join(', ');
    throw new Error(msgs);
  }
  if (err.response?.data?.error) {
    throw new Error(err.response.data.error);
  }
  throw err;
};

export const register = (data) => api.post('/register', data);

export const login = async (credentials) => {
  try {
    const res = await api.post('/login', credentials);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const logout = () => api.post('/logout');
export const getProfile = () => api.get('/profile');
