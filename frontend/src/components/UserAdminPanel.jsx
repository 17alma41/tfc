import React, { useEffect, useState } from 'react';
import {
  getAllUsers, getWorkers, getUserReservations,
  updateUser, deleteUser, createUser,
} from '../services/userService';
import { useAuth } from '../context/AuthContext';
import styles from '../dashboard/AdminDashboard.module.css';


export default function UserAdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name:'', email:'' });
  const [newUser, setNewUser] = useState({
    name:'', email:'', password:'', role:'trabajador'
  });

  const loadUsers = async () => {
    try {
      const res = user.role==='superadmin'
        ? await getAllUsers()
        : await getWorkers();
      setUsers(res.data);
    } catch {
      alert('Error cargando usuarios');
    }
  };
  useEffect(() => { if (user) loadUsers(); }, [user]);

  const handleCreate = async () => {
    if (!newUser.name||!newUser.email||!newUser.password)
      return alert('Rellena todos los campos.');
    try {
      await createUser(newUser);
      alert('Usuario creado');
      setNewUser({name:'',email:'',password:'',role:'trabajador'});
      loadUsers();
    } catch {
      alert('Error creando usuario');
    }
  };

  const handleShowReservations = async id => {
    try {
      const res = await getUserReservations(id);
      setReservations(res.data);
    } catch {
      alert('Error cargando reservas');
    }
  };
  const handleUpdate = async id => {
    try {
      await updateUser(id, form);
      setEditingId(null);
      loadUsers();
    } catch {
      alert('Error actualizando usuario');
    }
  };
  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch {
      alert('Error eliminando usuario');
    }
  };

  return (
    <div>
      <h2 className={styles.userPanelTitle}>Gestión de Usuarios</h2>

      <section className={styles.userPanelSection}>
        <h3 className={styles.userPanelTitle}>Crear nuevo usuario</h3>
        <div className={styles.userPanelForm}>
          {['name','email','password','role'].map(field => (
            <div key={field} className={styles.userFormGroup}>
              {field!=='role' ? (
                <input
                  type={field==='email'? 'email':'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                  value={newUser[field]}
                  onChange={e=>setNewUser({...newUser,[field]:e.target.value})}
                  className={styles.userInput}
                />
              ) : (
                <select
                  name="role"
                  value={newUser.role}
                  onChange={e=>setNewUser({...newUser,role:e.target.value})}
                  className={styles.userSelect}
                >
                  <option value="cliente">Cliente</option>
                  <option value="trabajador">Trabajador</option>
                  <option value="encargado">Encargado</option>
                  <option value="admin">Administrador</option>
                  {user.role==='superadmin' && (
                    <option value="superadmin">Superadmin</option>
                  )}
                </select>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleCreate} className={styles.userPanelButton}>
          Crear usuario
        </button>
      </section>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th>
            {user.role==='superadmin' && <th>Rol</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                {editingId===u.id
                  ? <input
                      value={form.name}
                      onChange={e=>setForm({...form,name:e.target.value})}
                      className={styles.userInput}
                    />
                  : u.name}
              </td>
              <td>
                {editingId===u.id
                  ? <input
                      value={form.email}
                      onChange={e=>setForm({...form,email:e.target.value})}
                      className={styles.userInput}
                    />
                  : u.email}
              </td>
              {user.role==='superadmin' && <td>{u.role}</td>}
              <td>
                {editingId===u.id ? (
                  <>
                    <button
                      onClick={()=>handleUpdate(u.id)}
                      className={styles.userPanelButton}
                    >Guardar</button>
                    <button
                      onClick={()=>setEditingId(null)}
                      className={styles.managerCancelButton}
                    >Cancelar</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={()=>handleShowReservations(u.id)}
                      className={styles.userPanelButton}
                    >Ver reservas</button>
                    <button
                      onClick={()=>{ setEditingId(u.id); setForm({name:u.name,email:u.email}); }}
                      className={styles.userPanelButton}
                    >Editar</button>
                    <button
                      onClick={()=>handleDelete(u.id)}
                      className={styles.managerCancelButton}
                    >Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reservations.length > 0 && (
        <section className={styles.userPanelSection}>
          <h3 className={styles.userPanelTitle}>Reservas del usuario</h3>
          <ul className={styles.managerList}>
            {reservations.map(r=>(
              <li key={r.id} className={styles.managerListItem}>
                <span className={styles.managerListItemInfo}>
                  {r.date} {r.time} — {r.service_title}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
