import React, { useEffect, useState } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../services/serviceService';
import styles from '../dashboard/AdminDashboard.module.css';

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', duration: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data);
    } catch {
      setMessage('No se pudieron cargar los servicios');
    }
  };

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateService(editingId, formData);
        setMessage('Servicio actualizado correctamente');
      } else {
        await createService(formData);
        setMessage('Servicio creado correctamente');
      }
      setFormData({ title:'',description:'',price:'',duration:'' });
      setIsEditing(false);
      fetchServices();
    } catch {
      setMessage('Error al guardar el servicio');
    }
  };

  const handleEdit = service => {
    setFormData(service);
    setIsEditing(true);
    setEditingId(service.id);
    setMessage('');
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar?')) return;
    try {
      await deleteService(id);
      setMessage('Servicio eliminado correctamente');
      fetchServices();
    } catch {
      setMessage('Error al eliminar servicio');
    }
  };

  return (
    <div>
      <h2 className={styles.managerTitle}>Gestión de Servicios</h2>
      {message && <p className={styles.managerMessage}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.managerForm}>
        <div className={styles.managerFormGroup}>
          <input
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            className={styles.managerInput}
            required
          />
        </div>
        <div className={styles.managerFormGroup}>
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            className={styles.managerTextarea}
            required
          />
        </div>
        <div className={styles.managerFormGroup}>
          <input
            name="price"
            type="number"
            placeholder="Precio (€)"
            value={formData.price}
            onChange={handleChange}
            className={styles.managerInput}
            required
          />
        </div>
        <div className={styles.managerFormGroup}>
          <input
            name="duration"
            type="number"
            placeholder="Duración (min)"
            value={formData.duration}
            onChange={handleChange}
            className={styles.managerInput}
            required
          />
        </div>
        <button type="submit" className={styles.managerButton}>
          {isEditing ? 'Actualizar' : 'Crear'} servicio
        </button>
        {isEditing && (
          <button
            type="button"
            className={styles.managerCancelButton}
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </button>
        )}
      </form>

      <ul className={styles.managerList}>
        {services.map(s => (
          <li key={s.id} className={styles.managerListItem}>
            <div className={styles.managerListItemInfo}>
              <strong>{s.title}</strong> — €{s.price} ({s.duration} min)
              <p>{s.description}</p>
            </div>
            <div className={styles.managerListItemButtons}>
              <button
                onClick={() => handleEdit(s)}
                className={styles.managerButton}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(s.id)}
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
