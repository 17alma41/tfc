import { Link, Outlet } from 'react-router-dom';

const SuperAdminDashboard = () => {
  return (
    <div>
      <h1>Panel de Superadministrador</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="profile" style={{ marginRight: '1rem' }}>Mi Perfil</Link>
        <Link to="users" style={{ marginRight: '1rem' }}>Gestión de Usuarios</Link>
        <Link to="services" style={{ marginRight: '1rem' }}>Gestión de Servicios</Link>
        <Link to="availability" style={{ marginRight: '1rem' }}>Gestión de Disponibilidad</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default SuperAdminDashboard;
