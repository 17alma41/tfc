import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { resetPasswordSchema } from '../validationSchemas';
import styles from './AuthForm.module.css';

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get('token');

  if (!token) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link to="/">
            <h1 className={styles.logo}>Hair Salon</h1>
          </Link>
          <nav className={styles.navLinks}>
            <Link to="/">Inicio</Link>
            <Link to="/reservar">Reservar</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/cookies">Cookies</Link>
          </nav>
        </header>
        <div className={styles.card}>
          <h1 className={styles.title}>Restablecer contraseña</h1>
          <p>Falta el token de recuperación.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>Hair Salon</Link>
      </header>
      <div className={styles.card}>
        <h1 className={styles.title}>Restablecer contraseña</h1>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={resetPasswordSchema}
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            try {
              await axios.post(
                '/api/auth/reset-password',
                { token, password: values.password, confirmPassword: values.confirmPassword },
                { withCredentials: true }
              );
              setStatus({ success: 'Contraseña cambiada con éxito. Ya puedes hacer login.' });
            } catch (err) {
              const msg = err.response?.data?.errors
                ? err.response.data.errors.map(e => e.msg).join(', ')
                : err.response?.data?.error || 'Token inválido o expirado.';
              setStatus({ error: msg });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Nueva contraseña</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Nueva contraseña"
                  className={styles.input}
                />
                <ErrorMessage name="password" component="div" className={styles.errorText} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirmar contraseña</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  className={styles.input}
                />
                <ErrorMessage name="confirmPassword" component="div" className={styles.errorText} />
              </div>

              {status?.error && (
                <div className={styles.errorText}>{status.error}</div>
              )}
              {status?.success && (
                <div style={{ color: 'green', marginBottom: '1rem' }}>
                  {status.success}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Cambiando…' : 'Cambiar contraseña'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
