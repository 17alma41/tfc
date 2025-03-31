import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Mientras se verifica la autenticación, muestra un indicador de carga
  if (loading) return <div>Cargando...</div>;

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Si se requiere un rol específico y el usuario no lo tiene, redirige al inicio
  if (role && user.role !== role) return <Navigate to="/" />;

  // Si pasa todas las verificaciones, renderiza el contenido protegido
  return children;
};

export default ProtectedRoute;