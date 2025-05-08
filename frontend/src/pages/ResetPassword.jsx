import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { resetPasswordSchema } from '../validationSchemas';

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get('token');

  if (!token) return <p>Falta token de recuperación.</p>;

  return (
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
        <Form>
          <h2>Restablecer contraseña</h2>

          <div>
            <Field
              name="password"
              type="password"
              placeholder="Nueva contraseña"
              className="form-control"
            />
            <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
          </div>

          <div>
            <Field
              name="confirmPassword"
              type="password"
              placeholder="Confirma tu contraseña"
              className="form-control"
            />
            <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
          </div>

          {status?.error   && <div className="text-red-600">{status.error}</div>}
          {status?.success && <div className="text-green-600">{status.success}</div>}

          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Cambiando…' : 'Cambiar contraseña'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
