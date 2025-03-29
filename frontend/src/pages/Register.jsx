import { useState } from 'react';
import { register } from '../services/authService';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'trabajador' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registro exitoso');
    } catch (err) {
      alert('Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
      <select name="role" onChange={handleChange}>
        <option value="trabajador">Trabajador</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Registrar</button>
    </form>
  );
}
