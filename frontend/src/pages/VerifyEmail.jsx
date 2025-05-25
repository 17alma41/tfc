import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './AuthForm.module.css';

export default function VerifyEmail() {
  const [search] = useSearchParams();
  const token = search.get('token');
  const [status, setStatus] = useState('Verificando…');

  useEffect(() => {
    if (!token) {
      setStatus('No se proporcionó token.');
      return;
    }
    axios
      .get(`/api/auth/verify-email?token=${token}`, { withCredentials: true })
      .then(() =>
        setStatus('Correo verificado correctamente. Ya puedes iniciar sesión.')
      )
      .catch(err => {
        console.error(err);
        setStatus('Token inválido o expirado.');
      });
  }, [token]);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.header}>
        <Link to="/" >
          <h1 className={styles.logo}>Hair Salon</h1>
        </Link>
      </header>

      {/* Tarjeta de contenido */}
      <div className={styles.card}>
        <h1 className={styles.title}>Verificación de Email</h1>
        <p style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
          {status}
        </p>
        {status.includes('correctamente') && (
          <Link to="/login" className={styles.submitButton}>
            Ir a Login
          </Link>
        )}
      </div>
    </div>
  );
}
