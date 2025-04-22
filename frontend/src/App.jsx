import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './dashboard/AdminDashboard';
import WorkerDashboard from './dashboard/WorkerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ServiceManager from './components/ServiceManager';
import WorkerProfile from './components/WorkerProfile';
import AdminProfile from './components/AdminProfile';
import MyReservations from './components/MyReservations';
import AvailabilityManager from './components/AvailabilityManager';
import UnavailableDaysManager from './components/UnavailableDaysManager';
import BookingPage from './pages/BookingPage';
import WelcomePage from './pages/WelcomePage';

function App() {
  return (
    <Router>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservar" element={<BookingPage />} />

        {/* Dashboard administrador con rutas anidadas*/}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<AdminProfile />} />
          <Route path="services" element={<ServiceManager />} />
        </Route>

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
          <Route path="descansos" element={<UnavailableDaysManager />} />
        </Route>

        {/* Página de servicios */}
        <Route
          path="/services"
          element={
            <ProtectedRoute roles={['admin', 'trabajador']}>
              <ServiceManager />
            </ProtectedRoute>
          }
        />

        {/* Página de inicio por defecto */}
        <Route 
          path="/" 
          element={
            <WelcomePage />
          } 
        > 
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reservar" element={<MyReservations />} />

        </Route>/

        {/* Página no autorizada */}  
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </Router>
  );
}

export default App;
