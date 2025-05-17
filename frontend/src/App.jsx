import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CookieBanner from './components/CookieBanner';

import WelcomePage from './pages/WelcomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import BookingPage from './pages/BookingPage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import OurWork from './pages/OurWork';

import ProtectedRoute from './components/ProtectedRoute';

import SuperAdminDashboard from './dashboard/SuperAdminDashboard';
import AdminDashboard      from './dashboard/AdminDashboard';
import WorkerDashboard     from './dashboard/WorkerDashboard';
import ClientDashboard     from './dashboard/ClientDashboard';

import SuperAdminProfile   from './components/SuperAdminProfile';
import AdminProfile        from './components/AdminProfile';
import WorkerProfile       from './components/WorkerProfile';
import ClientProfile       from './components/ClientProfile';

import UserAdminPanel          from './components/UserAdminPanel';
import ServiceManager          from './components/ServiceManager';
import MyReservations          from './components/MyReservations';
import ClientReservations      from './components/ClientReservations';
import AvailabilityManager     from './components/AvailabilityManager';
import UnavailableDaysManager  from './components/UnavailableDaysManager';

function App() {
  return (
    <>
      {/* Banner de Cookies: aparece en todas las páginas */}
      <CookieBanner />

      <Routes>
        {/* Rutas Públicas */}
        <Route path="/"                element={<WelcomePage />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/verify-email"    element={<VerifyEmail />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/unauthorized"    element={<Unauthorized />} />
        <Route path="/our-work"        element={<OurWork />} />

        {/* Rutas Legales */}
        <Route path="/terms"   element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />

        {/* Reserva de cita (solo cliente) */}
        <Route
          path="/reservation"
          element={
            <ProtectedRoute role="cliente">
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Superadmin */}
        <Route
          path="/dashboard/superadmin/*"
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

        {/* Dashboard Admin */}
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="services"     element={<ServiceManager />} />
          <Route path="workers" element={<UserAdminPanel />} />
        </Route>

        {/* Dashboard Worker */}
        <Route
          path="/dashboard/worker/*"
          element={
            <ProtectedRoute role="trabajador">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="my-reservations"       element={<MyReservations />} />
          <Route path="availability" element={<AvailabilityManager />} />
          <Route path="unavailable-days"      element={<UnavailableDaysManager />} />
        </Route>

        {/* Dashboard Cliente */}
        <Route
          path="/dashboard/client/*"
          element={
            <ProtectedRoute role="cliente">
              <ClientDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="my-reservations" element={<ClientReservations />} />
        </Route>

        {/* Gestión de servicios (admin/trabajador) */}
        <Route
          path="/services"
          element={
            <ProtectedRoute roles={['admin', 'trabajador']}>
              <ServiceManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
