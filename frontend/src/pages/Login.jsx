import { useState } from 'react';
import { login } from '../services/authService';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const role = res.data.role;
      if (role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (role === 'trabajador') {
        window.location.href = '/dashboard/worker';
      } else {
        window.location.href = '/';
      }
    } catch {
      alert('Login fallido');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Entrar</button>
    </form>
  );
}
