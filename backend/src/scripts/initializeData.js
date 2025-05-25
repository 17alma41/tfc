const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function initializeData() {
  try {
    // Usuarios predefinidos
    const users = [
      { email: 'alvaro@gmail.com', password: bcrypt.hashSync('alvaro', 10), role: 'cliente' },
      { email: 'worker@gmail.com', password: bcrypt.hashSync('worker', 10), role: 'trabajador' },
      { email: 'admin@gmail.com', password: bcrypt.hashSync('admin', 10), role: 'admin' },
    ];

    for (const user of users) {
      db.prepare(`INSERT INTO users (email, password, role) VALUES (?, ?, ?)`)
        .run(user.email, user.password, user.role);
    }

    // Servicios predefinidos
    const services = [
      { title: 'Corte de cabello', description: 'Servicio de corte de cabello', price: 15, duration: 30, created_by: 2 },
      { title: 'Corte de cabello + barba', description: 'Servicio de corte de cabello + barba', price: 20, duration: 45, created_by: 2 },
      { title: 'Lavado de cabello + peinado', description: 'Lavado de cabello + peinado', price: 10, duration: 30, created_by: 2 },
    ];

    for (const service of services) {
      db.prepare(`INSERT INTO services (title, description, price, duration, created_by) VALUES (?, ?, ?, ?, ?)`)
        .run(service.title, service.description, service.price, service.duration, service.created_by);
    }

    // Disponibilidad predefinida
    const availability = [
      { worker_id: 2, day_of_week: 'Monday', start_time: '09:00', end_time: '17:00' },
      { worker_id: 2, day_of_week: 'Tuesday', start_time: '09:00', end_time: '17:00' },
      { worker_id: 2, day_of_week: 'Wednesday', start_time: '09:00', end_time: '17:00' },
      { worker_id: 2, day_of_week: 'Thursday', start_time: '09:00', end_time: '17:00' },
      { worker_id: 2, day_of_week: 'Friday', start_time: '09:00', end_time: '17:00' }
    ];

    for (const slot of availability) {
      db.prepare(`INSERT INTO worker_availability (worker_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)`)
        .run(slot.worker_id, slot.day_of_week, slot.start_time, slot.end_time);
    }

    console.log('Datos iniciales insertados correctamente.');
  } catch (error) {
    console.error('Error al inicializar los datos:', error);
  }
}

initializeData();
