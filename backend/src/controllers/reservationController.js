const db = require('../config/db');
const dayjs = require('dayjs');

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

    if (!user_name || !user_email || !user_phone || !service_id || !worker_id || !date || !time) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Validar que el usuario no haya reservado en el pasado
    const reservationDateTime = dayjs(`${date}T${time}`);
    const now = dayjs();

    if (reservationDateTime.isBefore(now)) {
      return res.status(400).json({ error: 'No puedes reservar en el pasado' });
    }

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

// Genera los slots disponibles para un trabajador
function getAvailableSlots(worker_id, date, service_duration) {
  const unavailable = db.prepare(`
    SELECT * FROM worker_unavailable_days WHERE worker_id = ? AND date = ?
  `).get(worker_id, date);

  if (unavailable) return [];

  const dayOfWeek = dayjs(date).format('dddd').toLowerCase();

  const availability = db.prepare(`
    SELECT start_time, end_time FROM worker_availability
    WHERE worker_id = ? AND day_of_week = ?
  `).get(worker_id, dayOfWeek);

  if (!availability) return [];

  const { start_time, end_time } = availability;

  const toMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const fromMinutes = (mins) => {
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const start = toMinutes(start_time);
  const end = toMinutes(end_time);

  const booked = db.prepare(`
    SELECT time FROM reservations
    WHERE worker_id = ? AND date = ?
  `).all(worker_id, date).map(r => r.time);

  const slots = [];
  for (let t = start; t + service_duration <= end; t += service_duration) {
    const slot = fromMinutes(t);
    if (!booked.includes(slot)) {
      slots.push(slot);
    }
  }

  return slots;
}


exports.getWorkerAvailability = (req, res) => {
  const { worker_id, date, service_duration } = req.query;

  if (!worker_id || !date || !service_duration) {
    return res.status(400).json({ error: 'Parámetros faltantes' });
  }

  const slots = getAvailableSlots(
    parseInt(worker_id),
    date,
    parseInt(service_duration)
  );

  res.json(slots);
};
