import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Panel de Cliente</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="profile" style={{ marginRight: '1rem' }}>Mi Perfil</Link>
        <Link to="reservas" style={{ marginRight: '1rem' }}>Mi Historial</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default ClientDashboard;
