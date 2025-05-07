import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './dashboard/AdminDashboard';
import WorkerDashboard from './dashboard/WorkerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ServiceManager from './components/ServiceManager';
import WorkerProfile from './components/WorkerProfile';
import AdminProfile from './components/AdminProfile';
import SuperAdminProfile  from  './components/SuperAdminProfile';
import MyReservations from './components/MyReservations';
import AvailabilityManager from './components/AvailabilityManager';
import UnavailableDaysManager from './components/UnavailableDaysManager';
import UserAdminPanel from './components/UserAdminPanel';
import SuperAdminDashboard from './dashboard/SuperAdminDashboard';
import ClientDashboard from './dashboard/ClientDashboard';
import ClientProfile from './components/ClientProfile'; 
import ClientReservations from './components/ClientReservations';
import BookingPage from './pages/BookingPage';
import WelcomePage from './pages/WelcomePage';

function App() {
  return (
      <Routes>

        {/* Rutas públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/reservar" element={
          <ProtectedRoute role="cliente">
            <BookingPage />
          </ProtectedRoute>
        }/>

        {/* Dashboard superadmin con rutas anidadas*/}
        <Route
          path="/dashboard/superadmin"
          element={
            <ProtectedRoute role="superadmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="profile"      element={<SuperAdminProfile />} />
          <Route path="users"        element={<UserAdminPanel />} />
          <Route path="services"     element={<ServiceManager />} />
          <Route path="availability" element={<AvailabilityManager />} />
        </Route>

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
          <Route path="trabajadores" element={<UserAdminPanel />} />
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

        {/* Dashboard cliente */}
        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute role="cliente">
              <ClientDashboard />
            </ProtectedRoute>
          }
          >
          <Route path="profile" element={<ClientProfile />} />
          <Route path="reservas" element={<ClientReservations />} />
          
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
          <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/worker" element={<WorkerDashboard />} />
          <Route path="reservar" element={<MyReservations />} />

        </Route>/

        {/* Página no autorizada */}  
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
  );
}

export default App;
