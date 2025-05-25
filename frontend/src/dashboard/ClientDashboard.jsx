import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import styles from './ClientDashboard.module.css';

export default function ClientDashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <>
      {/* Header fijo */}
      <header className={styles.header}>
        <Link to="/">
          <h1 className={styles.logo}>Hair Salon</h1>
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

          <hr className={styles.separator} />
          <Link to="my-reservations" className={styles.navItem}>
            Citas
          </Link>
          <hr className={styles.separator} />
          <button onClick={logoutUser} className={styles.navItem}>
            Cerrar sesión
          </button>
          <hr className={styles.separator} />
        </aside>

        {/* Área de contenido */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
