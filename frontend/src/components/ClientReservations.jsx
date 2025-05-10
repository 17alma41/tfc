import { useEffect, useState } from 'react';
import { getClientReservations, cancelClientReservation } from '../services/bookingService';
import dayjs from 'dayjs';

export default function ClientReservations() {
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
      setReservations(prev => prev.map(r =>
        r.id === id ? { ...r, status: 'cancelled' } : r
      ));
      alert('Reserva cancelada correctamente');
    } catch (err) {
      console.error('Error al cancelar la reserva:', err);
      alert('No se pudo cancelar la reserva');
    }
  };

  const now = dayjs();

  return (
    <div>
      <h2>Mis Reservas</h2>
      {reservations.length === 0 ? (
        <p>No tienes reservas aún.</p>
      ) : (
        <ul>
          {reservations.map(r => {
            const isPast = now.isAfter(dayjs(`${r.date}T${r.time}`));
            return (
              <li key={r.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{r.date} {r.time}</strong> — {r.service_title} con {r.worker_name}
                {' '}
                {r.status === 'cancelled' && (
                  <span style={{ color: '#e53e3e', marginLeft: '1rem' }}>
                    (Cancelada)
                  </span>
                )}
                {!isPast && r.status === 'active' && (
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
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
