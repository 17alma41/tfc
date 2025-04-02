import { useEffect, useState } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../services/serviceService';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data);
    } catch (err) {
      console.error('Error al obtener servicios:', err);
      setMessage('No se pudieron cargar los servicios');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateService(editingId, formData);
        setMessage('Servicio actualizado correctamente');
      } else {
        await createService(formData);
        setMessage('Servicio creado correctamente');
      }
      resetForm();
      fetchServices();
    } catch (err) {
      console.error('Error al guardar servicio:', err);
      setMessage('Error al guardar el servicio');
    }
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
    setIsEditing(true);
    setEditingId(service.id);
    setMessage('');
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setMessage('Servicio eliminado correctamente');
      fetchServices();
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
      setMessage('Error al eliminar servicio');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', duration: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div>
      <h2>Gestión de Servicios</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Título del servicio"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción del servicio"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio (€)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duración (min)"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? 'Actualizar' : 'Crear'} servicio</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancelar</button>}
      </form>

      <ul>
        {services.length > 0 ? (
          services.map((service) => (
            <li key={service.id}>
              <strong>{service.title}</strong> - €{service.price} ({service.duration} min)
              <p>{service.description}</p>
              <button onClick={() => handleEdit(service)}>Editar</button>
              <button onClick={() => handleDelete(service.id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <p>No hay servicios registrados.</p>
        )}
      </ul>
    </div>
  );
};

export default ServiceManager;