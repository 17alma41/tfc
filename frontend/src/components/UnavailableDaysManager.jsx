import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from '../dashboard/WorkerDashboard.module.css';

export default function UnavailableDaysManager() {
  const { user } = useAuth();
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState('');
  const [reason, setReason] = useState('');

  const fetchDays = async () => {
    try {
      const res = await axios.get(`/api/unavailable-days/${user.id}`, { withCredentials:true });
      setDays(res.data);
    } catch {}
  };

  useEffect(() => { if (user?.id) fetchDays(); }, [user]);

  const handleAdd = async () => {
    if (!newDay) return alert('Selecciona una fecha');
    await axios.post('/api/unavailable-days', { date:newDay, reason }, { withCredentials:true });
    setNewDay(''); setReason('');
    fetchDays();
  };

  const handleDelete = async id => {
    if (!window.confirm('Eliminar este día?')) return;
    await axios.delete(`/api/unavailable-days/${id}`, { withCredentials:true });
    fetchDays();
  };

  return (
    <div>
      <h2 className={styles.sectionTitle}>Días no disponibles</h2>

      <div className={styles.managerForm}>
        <div className={styles.managerFormGroup}>
          <input
            type="date"
            value={newDay}
            onChange={e => setNewDay(e.target.value)}
            className={styles.managerInput}
          />
        </div>
        <div className={styles.managerFormGroup}>
          <input
            type="text"
            placeholder="Motivo (opcional)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className={styles.managerInput}
          />
        </div>
        <button onClick={handleAdd} className={styles.managerButton}>
          Añadir
        </button>
      </div>

      <ul className={styles.list}>
        {days.length === 0 ? (
          <p>No has marcado días como no disponibles.</p>
        ) : days.map(d => (
          <li key={d.id} className={styles.listItem}>
            <span className={styles.profileInfo}>
              {d.date}{d.reason && ` — ${d.reason}`}
            </span>
            <button
              onClick={() => handleDelete(d.id)}
              className={styles.managerCancelButton}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
