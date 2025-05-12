import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import styles from './Login.module.css';
import { loginSchema } from '../validationSchemas';

export default function Login() {
  const { loginUser } = useAuth();
  const initialValues = { email: '', password: '' };

  return (
    <div>
      {/* Navbar */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Hair Salon
        </Link>
      </header>

      {/* Contenedor centrado */}
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Iniciar sesión</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={(values, formikHelpers) =>
              loginUser(values, formikHelpers)
            }
          >
            {({ isSubmitting, status }) => (
              <Form className={styles.form}>
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
                  <div className={styles.errorMessage}>
                    {status.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? 'Entrando…' : 'Entrar'}
                </button>

                <Link
                  to="/forgot-password"
                  className={styles.forgotLink}
                >
                  ¿Olvidaste tu contraseña?
                </Link>

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

          <Link to="/register" className={styles.registerLink}>
            Crear una cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
