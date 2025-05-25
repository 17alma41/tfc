import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import styles from './WorkerDashboard.module.css';

export default function WorkerDashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <>
      <header className={styles.header}>
        <Link to="/">
          <h1 className={styles.logo}>Hair Salon</h1>
        </Link>
      </header>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {/* Cabecera de usuario */}
          <div className={styles.avatar}>
            <FaUserCircle className={styles.avatarIcon} />
          </div>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userEmail}>{user.email}</div>
          <div className={styles.userRole}>Rol: {user.role}</div>
          <hr className={styles.separator} />

          {/* Navegación */}
          <Link to="my-reservations" className={styles.navItem}>Mis Reservas</Link>
          <hr className={styles.separator} />
          <Link to="availability" className={styles.navItem}>Disponibilidad</Link>
          <hr className={styles.separator} />
          <Link to="unavailable-days" className={styles.navItem}>Días no disponibles</Link>
          <hr className={styles.separator} />
          <button onClick={logoutUser} className={styles.navItem}>Cerrar sesión</button>
        </aside>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
