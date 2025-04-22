import { useEffect, useState } from 'react';
import {
  getAllWorkers,
  getWorkerReservations,
  updateWorker,
  deleteWorker,
} from '../services/userService';

const WorkerAdminPanel = () => {
  const [workers, setWorkers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });

  const loadWorkers = () => {
    getAllWorkers().then(res => setWorkers(res.data));
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const handleShowReservations = async (id) => {
    const res = await getWorkerReservations(id);
    setReservations(res.data);
  };

  const handleEdit = (worker) => {
    setEditingId(worker.id);
    setForm({ name: worker.name, email: worker.email });
  };

  const handleUpdate = async (id) => {
    await updateWorker(id, form);
    setEditingId(null);
    loadWorkers();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que quieres eliminar este trabajador?')) {
      await deleteWorker(id);
      loadWorkers();
    }
  };

  return (
    <div>
      <h2>Gestión de Trabajadores</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {workers.map(w => (
            <tr key={w.id}>
              <td>{w.id}</td>
              <td>
                {editingId === w.id
                  ? <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  : w.name}
              </td>
              <td>
                {editingId === w.id
                  ? <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  : w.email}
              </td>
              <td>
                {editingId === w.id ? (
                  <>
                    <button onClick={() => handleUpdate(w.id)}>Guardar</button>
                    <button onClick={() => setEditingId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleShowReservations(w.id)}>Ver reservas</button>
                    <button onClick={() => handleEdit(w)}>Editar</button>
                    <button onClick={() => handleDelete(w.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reservations.length > 0 && (
        <div>
          <h3>Reservas del trabajador</h3>
          <ul>
            {reservations.map(r => (
              <li key={r.id}>
                {r.date} {r.time} - {r.user_name} - {r.service_title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkerAdminPanel;
