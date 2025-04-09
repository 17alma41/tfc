import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './dashboard/AdminDashboard';
import WorkerDashboard from './dashboard/WorkerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Services from './components/ServiceManager';

import WorkerProfile from './components/WorkerProfile';
import MyReservations from './components/MyReservations';
import AvailabilityManager from './components/AvailabilityManager';

function App() {
  return (
    <Router>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard administrador */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Dashboard trabajador con rutas anidadas */}
        <Route
          path="/dashboard/worker"
          element={
            <ProtectedRoute role="trabajador">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<WorkerProfile />} />
          <Route path="reservas" element={<MyReservations />} />
          <Route path="disponibilidad" element={<AvailabilityManager />} />
        </Route>

        {/* Página de servicios */}
        <Route
          path="/services"
          element={
            <ProtectedRoute roles={['admin', 'trabajador']}>
              <Services />
            </ProtectedRoute>
          }
        />

        {/* Página de inicio por defecto */}
        <Route path="/" element={<h1>Bienvenido a la aplicación</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
