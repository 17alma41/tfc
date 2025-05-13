import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getClientReservations, cancelClientReservation } from '../services/bookingService';
import styles from '../dashboard/ClientDashboard.module.css'; 

export default function ClientReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => { fetchReservations(); }, []);

  const fetchReservations = async () => {
    try {
      const res = await getClientReservations();
      setReservations(res.data);
    } catch {
      setReservations([]);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Seguro que quieres cancelar esta reserva?')) return;
    try {
      await cancelClientReservation(id);
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
      );
      alert('Reserva cancelada correctamente');
    } catch {
      alert('No se pudo cancelar la reserva');
    }
  };

  const now = dayjs();

  return (
    <div>
      <h2 className={styles.reservationsTitle}>Mis Reservas</h2>
      {reservations.length === 0 ? (
        <p>No tienes reservas aún.</p>
      ) : (
        <ul className={styles.reservationsList}>
          {reservations.map(r => {
            const isPast = now.isAfter(dayjs(`${r.date}T${r.time}`));
            return (
              <li key={r.id} className={styles.reservationItem}>
                <span className={styles.reservationInfo}>
                  <strong>{r.date} {r.time}</strong> — {r.service_title} con {r.worker_name}
                </span>
                {r.status === 'cancelled' && (
                  <span className={styles.statusCancelled}>(Cancelada)</span>
                )}
                {!isPast && r.status === 'active' && (
                  <button
                    onClick={() => handleCancel(r.id)}
                    className={styles.cancelButton}
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
