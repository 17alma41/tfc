import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema } from '../validationSchemas';
import styles from './AuthForm.module.css';

export default function ForgotPassword() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>Hair Salon</Link>
      </header>

      {/* Tarjeta de formulario */}
      <div className={styles.card}>
        <h1 className={styles.title}>Olvidé mi contraseña</h1>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            try {
              await axios.post('/api/auth/forgot-password', values, { withCredentials: true });
              setStatus({ success: 'Si existe esa cuenta, recibirás un email en breve.' });
            } catch (err) {
              const msg = err.response?.data?.errors
                ? err.response.data.errors.map(e => e.msg).join(', ')
                : err.response?.data?.error || 'Error al enviar el correo.';
              setStatus({ error: msg });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Tu email"
                  className={styles.input}
                />
                <ErrorMessage name="email" component="div" className={styles.errorText} />
              </div>

              {status?.error && <div className={styles.errorText}>{status.error}</div>}
              {status?.success && <div style={{ color: 'green', marginBottom: '1rem' }}>{status.success}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Enviando…' : 'Enviar email de recuperación'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
