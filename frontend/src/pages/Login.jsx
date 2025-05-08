import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; 
import { loginSchema } from '../validationSchemas';
import { FcGoogle } from 'react-icons/fc';

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

            <div style={{ marginTop: '1rem' }}>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <a
                href="http://localhost:3000/api/auth/google"
                className="btn btn-outline-secondary flex items-center"
              >
                <FcGoogle className="mr-2"/> Entrar con Google
              </a>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}
