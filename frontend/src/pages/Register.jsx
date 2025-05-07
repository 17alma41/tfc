import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';
import { registerSchema } from '../validationSchemas';

export default function Register() {
  const { user } = useAuth();
  const initialValues = { name:'', email:'', password:'', role:'cliente' };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await register(values);
      setStatus({ success:'Usuario registrado correctamente' });
    } catch (err) {
      setStatus({ error: err.response?.data?.error || 'Error al registrar' });
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
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm"/>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className="form-control"/>
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm"/>
            </div>

            <div>
              <label htmlFor="password">Contraseña</label>
              <Field name="password" type="password" className="form-control"/>
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm"/>
            </div>

            <div>
              <label htmlFor="role">Rol</label>
              <Field name="role" as="select" className="form-control">
                <option value="cliente">Cliente</option>
                <option value="trabajador">Trabajador</option>
                <option value="encargado">Encargado</option>
                <option value="admin">Administrador</option>
                <option value="superadmin">Superadmin</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-600 text-sm"/>
            </div>

            {status?.error   && <div className="text-red-600">{status.error}</div>}
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