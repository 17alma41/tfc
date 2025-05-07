import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import { loginSchema } from '../validationSchemas';

export default function Login() {
  const { loginUser } = useAuth();
  const initialValues = { email:'', password:'' };

  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={(values, formikHelpers) =>
          loginUser(values, formikHelpers)
        }
      >
        {({ isSubmitting, status }) => (
          <Form>
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

            {status?.error && <div className="text-red-600">{status.error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
