import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useState } from 'react';

const AdminProfile = () => {
  const { user, logoutUser } = useAuth();
  const [message, setMessage] = useState('');

  if (!user) return <p>Cargando perfil del administrador...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>

      <button onClick={logoutUser}>Cerrar sesión</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminProfile;
