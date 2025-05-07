import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const WelcomePage = () => {
    const { user, isAuthenticated, logout } = useAuth(); // Obtén el usuario autenticado y su rol

  return (
    <div>
      <h1>Bienvenido a la aplicación</h1>
      <nav style={{ marginBottom: '1rem' }}>

        {/* Si NO está autenticado, se muestra Login y Register */}
        {!isAuthenticated && (
          <>
            <Link to="login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="register" style={{ marginRight: '1rem' }}>Register</Link>
          </>
        )}

         {/* Si está autenticado y es superadmin, muestro su dashboard*/}
         {isAuthenticated && user.role === 'superadmin' && (
          <Link to="/dashboard/superadmin" style={{ marginRight: '1rem' }}>Mi panel Super Admin</Link>
        )}
        
        {/* Si está autenticado y es admin, muestro su dashboard*/}
        {isAuthenticated && user.role === 'admin' && (
          <Link to="/dashboard/admin" style={{ marginRight: '1rem' }}>Mi panel Admin</Link>
        )}

        {/* Si está autenticado y es trabajador, muestro su dashboard */}
         {isAuthenticated && user.role === 'trabajador' && (
          <Link to="/dashboard/worker" style={{ marginRight: '1rem' }}>Mi panel Trabajador</Link>
        )}

        {/* Si está autenticado y es cliente, muestro su dashboard */}
        {isAuthenticated && user.role === 'cliente' && (
        <Link to="/dashboard/client" style={{ marginRight: '1rem' }}>
          Mi panel
        </Link>
        )}
      
        {isAuthenticated && user.role === 'cliente' && (
          <Link to="reservar" style={{ marginRight: '1rem' }}>
            Reservar
          </Link>
        )}   
      


        {/* Si está autenticado, muestro botón para cerrar sesión
        {isAuthenticated && (
          <button onClick={logout} style={{ marginLeft: '2rem' }}>Cerrar sesión</button>
        )}
        */}
        
      </nav>
      <Outlet />
    </div>
  );
};

export default WelcomePage;