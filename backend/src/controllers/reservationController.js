const db = require('../config/db');

// Crear una nueva reserva
exports.createReservation = (req, res) => {
  try {
    const {
      user_name,
      user_email,
      user_phone,
      service_id,
      worker_id,
      date,
      time,
    } = req.body;

    // Verificar solapamiento
    const conflict = db.prepare(`
      SELECT * FROM reservations
      WHERE worker_id = ? AND date = ? AND time = ?
    `).get(worker_id, date, time);

    if (conflict) {
      return res.status(409).json({ error: 'Esa hora ya está reservada' });
    }

    const stmt = db.prepare(`
      INSERT INTO reservations
      (user_name, user_email, user_phone, service_id, worker_id, date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      user_name,
      user_email,
      user_phone,
      service_id,
      worker_id,
      date,
      time
    );

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear reserva', details: err.message });
  }
};

// Obtener reservas por trabajador
exports.getReservationsByWorker = (req, res) => {
  const worker_id = req.user.id;

  try {
    const stmt = db.prepare(`
      SELECT * FROM reservations
      WHERE worker_id = ?
      ORDER BY date, time
    `);

    const reservations = stmt.all(worker_id);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};
