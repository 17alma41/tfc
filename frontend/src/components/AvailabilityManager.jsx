import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const AvailabilityManager = () => {
    const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [newSlot, setNewSlot] = useState({
    day_of_week: 'monday',
    start_time: '',
    end_time: ''
  });

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(`/api/availability/${user.id}`, {
        withCredentials: true,
      });
      setAvailability(res.data);
    } catch (err) {
      console.error('Error al cargar disponibilidad:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAvailability();
    }
  }, [user]);

  const handleAddSlot = async () => {
    try {
      await axios.post('/api/availability', {
        ...newSlot,
        worker_id: user.id
      }, { withCredentials: true });
      fetchAvailability();
      setNewSlot({ day_of_week: 'monday', start_time: '', end_time: '' });
    } catch (err) {
      console.error('Error al añadir disponibilidad:', err);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await axios.delete(`/api/availability/${id}`, { withCredentials: true });
      fetchAvailability();
    } catch (err) {
      console.error('Error al eliminar franja:', err);
    }
  };

  return (
    <div>
      <h2>Mi disponibilidad semanal</h2>

      <div style={{ marginBottom: '1rem' }}>
        <select
          name="day"
          value={newSlot.day_of_week}
          onChange={(e) => setNewSlot({ ...newSlot, day_of_week: e.target.value })}
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
          ))}
        </select>
        <input
          type="time"
          value={newSlot.start_time}
          onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
        />
        <input
          type="time"
          value={newSlot.end_time}
          onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
        />
        <button onClick={handleAddSlot}>Añadir</button>
      </div>

      {availability.length === 0 ? (
        <p>No tienes disponibilidad configurada.</p>
      ) : (
        <ul>
          {availability.map((slot) => (
            <li key={slot.id}>
              <strong>{slot.day_of_week}</strong>: {slot.start_time} - {slot.end_time}
              <button onClick={() => handleDeleteSlot(slot.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailabilityManager;
