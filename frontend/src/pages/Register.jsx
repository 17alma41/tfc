import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';

export default function Register() {
  const { user } = useAuth(); // ← dentro del componente
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    role:     'cliente'      // o el rol por defecto que quieras
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registro exitoso');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
      />

      {(
        process.env.NODE_ENV === 'development' ||
        user?.role === 'superadmin'
      ) && (
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="cliente">Cliente</option>
          <option value="trabajador">Trabajador</option>
          <option value="encargado">Encargado</option>
          <option value="admin">Administrador</option>
          <option value="superadmin">Superadmin</option>
        </select>
      )}

      <button type="submit">Registrar</button>
    </form>
  );
}
