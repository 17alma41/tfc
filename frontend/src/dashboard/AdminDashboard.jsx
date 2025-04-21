import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Panel de Administrador</h1>
      <nav style={{ marginBottom: '1rem' }}>
        {/* Rutas anidadas */}
        <Link to="profile" style={{ marginRight: '1rem' }}>Mi Perfil</Link>
        <Link to="services">Gestionar Servicios</Link>
      </nav>

      <Outlet />
    </div>
  );
};

export default AdminDashboard;
