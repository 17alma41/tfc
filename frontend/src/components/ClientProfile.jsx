import { useAuth } from '../context/AuthContext';

const ClientProfile = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>

      {/* Botón de cerrar sesión */}
      <button
        onClick={logoutUser}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default ClientProfile;
