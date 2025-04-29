import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const SuperAdminProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setMessage('Sesión cerrada correctamente.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setMessage('Error al cerrar sesión.');
    }
  };

  if (!user) return <p>Cargando perfil del super administrador...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>

      <button onClick={handleLogout}>Cerrar sesión</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default SuperAdminProfile;
