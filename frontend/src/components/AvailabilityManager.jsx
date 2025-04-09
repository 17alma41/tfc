import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const AvailabilityManager = () => {
  const { user } = useAuth();

  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({
    day_of_week: 'monday',
    start_time: '',
    end_time: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(`/api/availability/${user.id}`, {
        withCredentials: true
      });
      setAvailability(res.data);
    } catch (err) {
      console.error('Error al cargar disponibilidad:', err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchAvailability();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Actualizar horario
        await axios.put(`/api/availability/${editingId}`, form, {
          withCredentials: true
        });
      } else {
        // Crear nuevo horario
        await axios.post('/api/availability', {
          ...form,
          worker_id: user.id
        }, {
          withCredentials: true
        });
      }

      setForm({ day_of_week: 'monday', start_time: '', end_time: '' });
      setEditingId(null);
      fetchAvailability();
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
      fetchAvailability();
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
        <p>No tienes horarios configurados.</p>
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
