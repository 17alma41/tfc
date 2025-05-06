import { useEffect, useState } from 'react';
import { getClientReservations } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      getClientReservations()
        .then(res => setReservations(res.data))
        .catch(err => setError(err.response?.data?.error || 'Error al cargar reservas'));
    }
  }, [loading]);

  if (loading) return <p>Cargando tu historial…</p>;
  if (error)   return <p style={{color:'red'}}>{error}</p>;

  return (
    <div>
      <h1>Historial de reservas</h1>
      {reservations.length === 0
        ? <p>No tienes reservas aún.</p>
        : (
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Trabajador</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.service_title}</td>
                  <td>{r.worker_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  );
}