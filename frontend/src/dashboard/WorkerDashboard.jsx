import { Link, Outlet } from 'react-router-dom';


const WorkerDashboard = () => {
  return (
    <div>
      <h1>Panel del trabajador</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="profile" style={{ marginRight: '1rem' }}>Mi Perfil</Link>
        <Link to="reservas" style={{ marginRight: '1rem' }}>Mis Reservas</Link>
        <Link to="disponibilidad">Disponibilidad</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default WorkerDashboard;
