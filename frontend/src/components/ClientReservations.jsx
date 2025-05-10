import { useEffect, useState } from 'react';
import { getClientReservations, cancelClientReservation } from '../services/bookingService';

const ClientReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await getClientReservations();
      setReservations(res.data);
    } catch (err) {
      console.error('Error al cargar tus reservas:', err);
      setReservations([]);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Seguro que quieres cancelar esta reserva?')) return;
    try {
      await cancelClientReservation(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      alert('Reserva cancelada correctamente');
    } catch (err) {
      console.error('Error al cancelar la reserva:', err);
      alert('No se pudo cancelar la reserva');
    }
  };

  return (
    <div>
      <h2>Mis Reservas</h2>
      {reservations.length === 0 ? (
        <p>No tienes reservas aún.</p>
      ) : (
        <ul>
          {reservations.map(r => (
            <li key={r.id} style={{ marginBottom: '0.5rem' }}>
              {r.date} {r.time} — {r.service_title} con {r.worker_name}
              <button
                onClick={() => handleCancel(r.id)}
                style={{
                  marginLeft: '1rem',
                  padding: '0.2rem 0.5rem',
                  background: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientReservations;
