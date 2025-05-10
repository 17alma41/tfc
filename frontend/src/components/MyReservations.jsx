// src/components/MyReservations.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [message, setMessage]           = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reservations/mine', { 
        withCredentials: true
      });
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Seguro que quieres cancelar esta reserva?')) return;
    try {
      await axios.delete(`/api/reservations/${id}`, {
        withCredentials: true
      });
      setReservations(reservations.filter(r => r.id !== id));
      setMessage('Reserva cancelada y cliente notificado');
    } catch (err) {
      console.error(err);
      setMessage('No se pudo cancelar la reserva');
    }
  };

  if (loading) return <p>Cargando reservas…</p>;

  return (
    <div>
      <h2>Reservas asignadas</h2>
      {message && <p>{message}</p>}
      {reservations.length === 0 ? (
        <p>No tienes reservas asignadas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Fecha</th><th>Hora</th><th>Cliente</th><th>Servicio</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.user_name}</td>
                <td>{r.service_title}</td>
                <td>
                  <button onClick={() => handleCancel(r.id)}>
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
