import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { register } from '../services/authService';
import { registerSchema } from '../validationSchemas';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import styles from './Register.module.css';

export default function Register() {
  const initialValues = { name: '', email: '', password: '' };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await register({ ...values, role: 'cliente' });
      setStatus({ success: 'Revisa tu email para activar tu cuenta.' });
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Error al registrar';
      setStatus({ error: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Hair Salon
        </Link>
      </header>

      {/* Contenedor centrado */}
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Registro</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nombre
                  </label>
                  <Field name="name" className={styles.input} />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className={styles.input}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Contraseña
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className={styles.input}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>

                {status?.error && (
                  <div className={styles.errorMessage}>{status.error}</div>
                )}
                {status?.success && (
                  <div className={styles.successMessage}>{status.success}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? 'Registrando…' : 'Registrar'}
                </button>

                {/* Botón Google */}
                <a
                  href="http://localhost:3000/api/auth/google"
                  className={styles.googleButton}
                >
                  <FcGoogle className={styles.googleIcon} />
                  Entrar con Google
                </a>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
