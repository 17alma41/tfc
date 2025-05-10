import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
  const [search] = useSearchParams();
  const token = search.get('token');
  const [status, setStatus] = useState('Verificando…');

  useEffect(() => {
    if (!token) {
      setStatus('No se proporcionó token.');
      return;
    }
    axios.get(`/api/auth/verify-email?token=${token}`, { withCredentials: true })
      .then(() => setStatus('Correo verificado correctamente. Ya puedes iniciar sesión.'))
      .catch(err => {
        console.error(err);
        setStatus('Token inválido o expirado.');
      });
  }, [token]);

  return (
    <div>
      <h2>Verificación de Email</h2>
      <p>{status}</p>
      {status.includes('correctamente') && (
        <Link to="/login">Ir a Login</Link>
      )}
    </div>
  );
}
