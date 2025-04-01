import { useEffect, useState } from 'react';
import { createService, getServices, updateService, deleteService } from '../services/serviceService';

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '' });
  const [editingService, setEditingService] = useState(null); // Servicio en edición

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await getServices();
      setServices(data);
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingService) {
      // Actualizar servicio
      await updateService(editingService.id, form);
      setEditingService(null);
    } else {
      // Crear servicio
      await createService(form);
    }
    setForm({ title: '', description: '', price: '' });
    const { data } = await getServices();
    setServices(data);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setForm({ title: service.title, description: service.description, price: service.price });
  };

  const handleDelete = async (id) => {
    await deleteService(id);
    setServices(services.filter((service) => service.id !== id));
  };

  return (
    <div>
      <h1>Servicios</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Precio (€)"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingService ? 'Actualizar Servicio' : 'Crear Servicio'}</button>
      </form>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {service.title} - {service.description} - {service.price} €
            <button onClick={() => handleEdit(service)}>Editar</button>
            <button onClick={() => handleDelete(service.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}