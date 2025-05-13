import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import styles from './SuperAdminDashboard.module.css';

export default function SuperAdminDashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Hair Salon
        </Link>
      </header>

      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.avatar}>
            <FaUserCircle className={styles.avatarIcon} />
          </div>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userEmail}>{user.email}</div>
          <div className={styles.userRole}>Rol: {user.role}</div>
          <hr className={styles.separator} />

          <Link to="users" className={styles.navItem}>Gestión de Usuarios</Link>
          <hr className={styles.separator} />
          <Link to="services" className={styles.navItem}>Gestión de Servicios</Link>
          <hr className={styles.separator} />
          <Link to="availability" className={styles.navItem}>Gestión de Disponibilidad</Link>
          <hr className={styles.separator} />
          <button onClick={logoutUser} className={styles.navItem}>
            Cerrar sesión
          </button>
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
