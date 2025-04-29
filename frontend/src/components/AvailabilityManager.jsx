import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const AvailabilityManager = () => {
  const { user } = useAuth();

  const [workers, setWorkers] = useState([]);
  const [workerId, setWorkerId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({
    day_of_week: 'monday',
    start_time: '',
    end_time: ''
  });
  const [editingId, setEditingId] = useState(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const fetchWorkers = async () => {
    try {
      const res = await axios.get('/api/users/workers', { withCredentials: true });
      setWorkers(res.data);
      if (res.data.length > 0) {
        setWorkerId(res.data[0].id); // Por defecto selecciona el primero
      }
    } catch (err) {
      console.error('Error al obtener trabajadores:', err);
    }
  };

  const fetchAvailability = async (id) => {
    try {
      const res = await axios.get(`/api/availability/${id}`, {
        withCredentials: true
      });
      setAvailability(res.data);
    } catch (err) {
      console.error('Error al cargar disponibilidad:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchWorkers();
    } else {
      setWorkerId(user?.id);
    }
  }, [user]);

  useEffect(() => {
    if (workerId) fetchAvailability(workerId);
  }, [workerId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/availability/${editingId}`, form, {
          withCredentials: true
        });
      } else {
        await axios.post('/api/availability', {
          ...form,
          worker_id: workerId
        }, {
          withCredentials: true
        });
      }

      setForm({ day_of_week: 'monday', start_time: '', end_time: '' });
      setEditingId(null);
      fetchAvailability(workerId);
    } catch (err) {
      console.error('Error al guardar disponibilidad:', err);
    }
  };

  const handleEdit = (slot) => {
    setForm({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time
    });
    setEditingId(slot.id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Eliminar este bloque de horario?');
    if (!confirm) return;

    try {
      await axios.delete(`/api/availability/${id}`, {
        withCredentials: true
      });
      fetchAvailability(workerId);
    } catch (err) {
      console.error('Error al eliminar disponibilidad:', err);
    }
  };

  const cancelEdit = () => {
    setForm({ day_of_week: 'monday', start_time: '', end_time: '' });
    setEditingId(null);
  };

  return (
    <div>
      <h2>Gestión de disponibilidad</h2>

      {isAdmin && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Seleccionar trabajador: </label>
          <select
            value={workerId || ''}
            onChange={e => setWorkerId(e.target.value)}
          >
            <option value={user.id}>👤 Yo mismo ({user.name})</option>
              {workers.map(w => (
                w.id !== user.id && (
                  <option key={w.id} value={w.id}>{w.name}</option>
                )
              ))}
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3>{editingId ? 'Editar horario' : 'Añadir nuevo horario'}</h3>

        <select
          name="day_of_week"
          value={form.day_of_week}
          onChange={handleChange}
          required
        >
          {daysOfWeek.map(day => (
            <option key={day} value={day}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />

        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        {editingId && <button type="button" onClick={cancelEdit}>Cancelar</button>}
      </form>

      <hr />

      <h3>Disponibilidad actual</h3>
      {availability.length === 0 ? (
        <p>No hay horarios configurados.</p>
      ) : (
        <ul>
          {availability.map(slot => (
            <li key={slot.id}>
              <strong>{slot.day_of_week}</strong>: {slot.start_time} – {slot.end_time}
              <button onClick={() => handleEdit(slot)}>Editar</button>
              <button onClick={() => handleDelete(slot.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailabilityManager;
