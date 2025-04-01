import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './dashboard/AdminDashboard';
import WorkerDashboard from './dashboard/WorkerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Services from './pages/Services';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/worker"
          element={
            <ProtectedRoute role="trabajador">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute roles={['admin', 'trabajador']}>
              <Services />
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="/" element={<h1>Bienvenido a la aplicación</h1>} />
      </Routes>
    </Router>
  );
}

export default App;