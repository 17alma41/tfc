import { useEffect, useState } from 'react';
import axios from 'axios';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get('/api/reservations/mine', { withCredentials: true });
        console.log('Datos recibidos:', res.data);
        setReservations(res.data);
      } catch (err) {
        console.error('Error al cargar reservas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p>Cargando reservas...</p>;

  if (reservations.length === 0) return <p>No tienes reservas programadas.</p>;

  return (
    <div>
      <h2>Mis reservas</h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
            {(Array.isArray(reservations) ? reservations : []).map((res) => (
            <tr key={res.id}>
              <td>{res.user_name}</td>
              <td>{res.service_id}</td>
              <td>{res.date}</td>
              <td>{res.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyReservations;
