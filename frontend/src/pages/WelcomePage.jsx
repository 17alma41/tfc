import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de tener un contexto de autenticación

const WelcomePage = () => {
  const { user } = useAuth(); // Obtén el usuario autenticado y su rol

  return (
    <div>
      <h1>Bienvenido a la aplicación</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="login" style={{ marginRight: '1rem' }}>Login</Link>
        {user?.role === 'admin' && (
          <Link to="register" style={{ marginRight: '1rem' }}>Register</Link>
        )}
        <Link to="reservar" style={{ marginRight: '1rem' }}>Reservar</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default WelcomePage;