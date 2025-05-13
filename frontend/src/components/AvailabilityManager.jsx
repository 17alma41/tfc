import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from '../dashboard/WorkerDashboard.module.css';

const daysOfWeek = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default function AvailabilityManager() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [workerId, setWorkerId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({ day_of_week:'monday', start_time:'', end_time:'' });
  const [editingId, setEditingId] = useState(null);
  const isAdmin = user.role === 'admin' || user.role === 'superadmin';

  useEffect(() => {
    if (isAdmin) fetchWorkers();
    else setWorkerId(user.id);
  }, [user]);

  useEffect(() => { if (workerId) fetchAvailability(workerId); }, [workerId]);

  const fetchWorkers = async () => {
    try {
      const res = await axios.get('/api/users/workers', { withCredentials:true });
      setWorkers(res.data);
      setWorkerId(res.data[0]?.id);
    } catch {}
  };
  const fetchAvailability = async id => {
    try {
      const res = await axios.get(`/api/availability/${id}`, { withCredentials:true });
      setAvailability(res.data);
    } catch {}
  };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId)
        await axios.put(`/api/availability/${editingId}`, form, { withCredentials:true });
      else
        await axios.post('/api/availability', { ...form, worker_id:workerId }, { withCredentials:true });
      setForm({ day_of_week:'monday', start_time:'', end_time:'' });
      setEditingId(null);
      fetchAvailability(workerId);
    } catch {}
  };
  const handleEdit = slot => {
    setForm({ day_of_week:slot.day_of_week, start_time:slot.start_time, end_time:slot.end_time });
    setEditingId(slot.id);
  };
  const handleDelete = async id => {
    if (!window.confirm('Eliminar este bloque?')) return;
    await axios.delete(`/api/availability/${id}`, { withCredentials:true });
    fetchAvailability(workerId);
  };
  const cancelEdit = () => setEditingId(null) || setForm({ day_of_week:'monday', start_time:'', end_time:'' });

  return (
    <div>
      <h2 className={styles.sectionTitle}>Gestión de disponibilidad</h2>

      {isAdmin && (
        <div className={styles.managerForm}>
          <div className={styles.managerFormGroup}>
            <label>Trabajador</label>
            <select
              name="worker"
              value={workerId || ''}
              onChange={e => setWorkerId(e.target.value)}
              className={styles.managerSelect}
            >
              <option value={user.id}>Yo ({user.name})</option>
              {workers.map(w =>
                w.id !== user.id && (
                  <option key={w.id} value={w.id}>{w.name}</option>
                )
              )}
            </select>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.managerForm}>
        <div className={styles.managerFormGroup}>
          <label>Día</label>
          <select
            name="day_of_week"
            value={form.day_of_week}
            onChange={handleChange}
            className={styles.managerSelect}
          >
            {daysOfWeek.map(d => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.managerFormGroup}>
          <label>Inicio</label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className={styles.managerInput}
            required
          />
        </div>
        <div className={styles.managerFormGroup}>
          <label>Fin</label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className={styles.managerInput}
            required
          />
        </div>

        <button type="submit" className={styles.managerButton}>
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className={styles.managerCancelButton}
          >
            Cancelar
          </button>
        )}
      </form>

      <ul className={styles.list}>
        {availability.length === 0 ? (
          <p>No hay horarios configurados.</p>
        ) : availability.map(slot => (
          <li key={slot.id} className={styles.listItem}>
            <span className={styles.profileInfo}>
              <strong>{slot.day_of_week}</strong>: {slot.start_time} – {slot.end_time}
            </span>
            <div>
              <button
                onClick={() => handleEdit(slot)}
                className={styles.managerButton}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(slot.id)}
                className={styles.managerCancelButton}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
