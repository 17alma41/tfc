import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
  if (!isAuthenticated) return <Navigate to="/login" />;

  const allowedRoles = roles || (role ? [role] : []);

  // Si se especifica un rol y el usuario no tiene ese rol, redirigir a la página de acceso no autorizado
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
