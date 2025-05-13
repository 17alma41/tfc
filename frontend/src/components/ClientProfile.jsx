import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../dashboard/ClientDashboard.module.css'; 

export default function ClientProfile() {
  const { user, logoutUser } = useAuth();

  return (
    <div>
      <h2 className={styles.profileTitle}>Mi Perfil</h2>
      <p className={styles.profileInfo}><strong>Nombre:</strong> {user.name}</p>
      <p className={styles.profileInfo}><strong>Email:</strong> {user.email}</p>
      <p className={styles.profileInfo}><strong>Rol:</strong> {user.role}</p>

      <button onClick={logoutUser} className={styles.logoutButton}>
        Cerrar sesión
      </button>
    </div>
  );
}
