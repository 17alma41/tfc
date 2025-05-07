// src/pages/Register.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { register } from '../services/authService';
import { registerSchema } from '../validationSchemas';

export default function Register() {
  const initialValues = { name: '', email: '', password: '' };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // Forzamos role = 'cliente'
      await register({ ...values, role: 'cliente' });
      setStatus({ success: 'Usuario registrado correctamente' });
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Error al registrar';
      setStatus({ error: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div>
              <label htmlFor="name">Nombre</label>
              <Field name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <label htmlFor="password">Contraseña</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
            </div>

            {status?.error && <div className="text-red-600">{status.error}</div>}
            {status?.success && <div className="text-green-600">{status.success}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Registrando…' : 'Registrar'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
