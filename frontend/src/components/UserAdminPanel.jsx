import { useEffect, useState } from 'react';
import {
  getAllUsers,
  getWorkers,
  getUserReservations,
  updateUser,
  deleteUser,
  createUser
} from '../services/userService';
import { useAuth } from '../context/AuthContext';

const UserAdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'trabajador'
  });

  // Carga usuarios según rol
  const loadUsers = async () => {
    try {
      const res = user.role === 'superadmin'
        ? await getAllUsers()
        : await getWorkers();
      setUsers(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      alert('No se han podido cargar los usuarios');
    }
  };

  useEffect(() => {
    if (user) loadUsers();
  }, [user]);

  // Crear usuario
  const handleCreate = async () => {
    const { name, email, password, role } = newUser;
    if (!name || !email || !password || !role) {
      return alert('Rellena todos los campos.');
    }
    try {
      await createUser(newUser);
      alert('Usuario creado correctamente');
      setNewUser({ name: '', email: '', password: '', role: 'trabajador' });
      loadUsers();
    } catch (err) {
      console.error('Error al crear usuario:', err);
      alert(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  // Mostrar reservas de un usuario
  const handleShowReservations = async (id) => {
    try {
      const res = await getUserReservations(id);
      setReservations(res.data);
    } catch (err) {
      console.error('Error al obtener reservas:', err);
      alert('No se han podido cargar las reservas');
    }
  };

  // Iniciar edición
  const handleEdit = (u) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email });
  };

  // Guardar edición
  const handleUpdate = async (id) => {
    try {
      await updateUser(id, form);
      setEditingId(null);
      loadUsers();
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      alert('Error al actualizar usuario');
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>

      {/* Formulario de creación */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Crear nuevo usuario</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.name}
          onChange={e => setNewUser({ ...newUser, name: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        />
        <select
          value={newUser.role}
          onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          style={{ marginRight: '0.5rem' }}
        >
          <option value="cliente">Cliente</option>
          <option value="trabajador">Trabajador</option>
          <option value="encargado">Encargado</option>
          <option value="admin">Administrador</option>
          {user.role === 'superadmin' && <option value="superadmin">Superadmin</option>}
        </select>
        <button onClick={handleCreate}>Crear usuario</button>
      </div>

      {/* Tabla de usuarios */}
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            {user.role === 'superadmin' && <th>Rol</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                {editingId === u.id
                  ? <input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  : u.name}
              </td>
              <td>
                {editingId === u.id
                  ? <input
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  : u.email}
              </td>
              {user.role === 'superadmin' && <td>{u.role}</td>}
              <td>
                {editingId === u.id ? (
                  <>
                    <button onClick={() => handleUpdate(u.id)}>Guardar</button>
                    <button onClick={() => setEditingId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleShowReservations(u.id)}>Ver reservas</button>
                    <button onClick={() => handleEdit(u)}>Editar</button>
                    <button onClick={() => handleDelete(u.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reservas */}
      {reservations.length > 0 && (
        <div>
          <h3>Reservas del usuario</h3>
          <ul>
            {reservations.map(r => (
              <li key={r.id}>
                {r.date} {r.time} — {r.user_name} — {r.service_title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserAdminPanel;
