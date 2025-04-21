import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UnavailableDaysManager = () => {
  const { user } = useAuth();
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState('');
  const [reason, setReason] = useState('');

  const fetchDays = async () => {
    try {
      const res = await axios.get(`/api/unavailable-days/${user.id}`);
      setDays(res.data);
    } catch (err) {
      console.error('Error al obtener días no disponibles:', err);
    }
  };

  const handleAdd = async () => {
    if (!newDay) return alert('Selecciona una fecha');
    try {
      await axios.post('/api/unavailable-days', {
        date: newDay,
        reason
      });
      setNewDay('');
      setReason('');
      fetchDays();
    } catch (err) {
      console.error('Error al agregar día no disponible:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este día como no disponible?')) return;
    try {
      await axios.delete(`/api/unavailable-days/${id}`);
      fetchDays();
    } catch (err) {
      console.error('Error al eliminar día:', err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchDays();
  }, [user]);

  return (
    <div>
      <h2>Días no disponibles</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="date"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
        />
        <input
          type="text"
          placeholder="Motivo (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button onClick={handleAdd}>Añadir</button>
      </div>

      {days.length === 0 ? (
        <p>No has marcado días como no disponibles.</p>
      ) : (
        <ul>
          {days.map((d) => (
            <li key={d.id}>
              {d.date} {d.reason && `— ${d.reason}`}
              <button onClick={() => handleDelete(d.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnavailableDaysManager;
