import { useEffect, useState } from 'react';
import { getClientReservations } from '../services/bookingService';

const ClientReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    getClientReservations()
      .then(res => setReservations(res.data))
      .catch(err => {
        console.error('Error al cargar tus reservas:', err);
        setReservations([]);
      });
  }, []);

  return (
    <div>
      <h2>Mis Reservas</h2>
      {reservations.length === 0 ? (
        <p>No tienes reservas aún.</p>
      ) : (
        <ul>
          {reservations.map(r => (
            <li key={r.id}>
              {r.date} {r.time} — {r.service_title} con {r.worker_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientReservations;
