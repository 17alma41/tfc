const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function initializeData() {
  try {
    // Usuarios predefinidos con nombres
    const users = [
      { name: 'Álvaro', email: 'alvaro@gmail.com', password: bcrypt.hashSync('alvaro', 10), role: 'cliente' },
      { name: 'Trabajador', email: 'worker@gmail.com', password: bcrypt.hashSync('worker', 10), role: 'trabajador' },
      { name: 'Administrador', email: 'admin@gmail.com', password: bcrypt.hashSync('admin', 10), role: 'admin' },
    ];

    for (const user of users) {
      const exists = db.prepare(`SELECT 1 FROM users WHERE email = ?`).get(user.email);
      if (!exists) {
        db.prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`)
          .run(user.name, user.email, user.password, user.role);
      }
    }

    // Obtener el ID del trabajador para la disponibilidad
    const worker = db.prepare(`SELECT id FROM users WHERE email = ?`).get('worker@gmail.com');
    if (!worker) {
      throw new Error('El trabajador no existe en la base de datos.');
    }

    // Servicios predefinidos
    const services = [
      { title: 'Corte de cabello', description: 'Servicio de corte de cabello', price: 15, duration: 30, created_by: worker.id },
      { title: 'Corte de cabello + barba', description: 'Servicio de corte de cabello + barba', price: 20, duration: 45, created_by: worker.id },
      { title: 'Lavado de cabello + peinado', description: 'Lavado de cabello + peinado', price: 10, duration: 30, created_by: worker.id },
    ];

    for (const service of services) {
      const exists = db.prepare(`SELECT 1 FROM services WHERE title = ?`).get(service.title);
      if (!exists) {
        db.prepare(`INSERT INTO services (title, description, price, duration, created_by) VALUES (?, ?, ?, ?, ?)`)
          .run(service.title, service.description, service.price, service.duration, service.created_by);
      }
    }

    // Disponibilidad predefinida
    const availability = [
      { worker_id: worker.id, day_of_week: 'monday', start_time: '09:00', end_time: '17:00' },
      { worker_id: worker.id, day_of_week: 'tuesday', start_time: '09:00', end_time: '17:00' },
      { worker_id: worker.id, day_of_week: 'wednesday', start_time: '09:00', end_time: '17:00' },
      { worker_id: worker.id, day_of_week: 'thursday', start_time: '09:00', end_time: '17:00' },
      { worker_id: worker.id, day_of_week: 'friday', start_time: '09:00', end_time: '17:00' }
    ];

    for (const slot of availability) {
      const exists = db.prepare(`
        SELECT 1 FROM worker_availability 
        WHERE worker_id = ? AND day_of_week = ?
      `).get(slot.worker_id, slot.day_of_week);
      if (!exists) {
        db.prepare(`INSERT INTO worker_availability (worker_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)`)
          .run(slot.worker_id, slot.day_of_week, slot.start_time, slot.end_time);
      }
    }

    console.log('✅ Datos iniciales insertados correctamente.');
  } catch (error) {
    console.error('❌ Error al inicializar los datos:', error);
  }
}

initializeData();
