import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { forgotPasswordSchema } from '../validationSchemas';

export default function ForgotPassword() {
  return (
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
        <Form>
          <h2>Olvidé mi contraseña</h2>
          <div>
            <Field
              name="email"
              type="email"
              placeholder="Tu email"
              className="form-control"
            />
            <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
          </div>

          {status?.error   && <div className="text-red-600">{status.error}</div>}
          {status?.success && <div className="text-green-600">{status.success}</div>}

          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Enviando…' : 'Enviar email de recuperación'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
