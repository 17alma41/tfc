
const db    = require('../config/db');
const dayjs = require('dayjs');

/**
 * Crea una reserva. Sólo clientes.
 */
exports.createReservation = (req, res) => {
  try {
    const { service_id, worker_id, date, time, user_phone } = req.body;
    const userId = req.user.id; // de verifyToken

    // 1) Validar campos
    if (!user_phone || !service_id || !worker_id || !date || !time) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // 2) Traer nombre y email reales del usuario
    const user = db
      .prepare('SELECT name, email FROM users WHERE id = ?')
      .get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 3) No en el pasado
    const requested = dayjs(`${date}T${time}`);
    if (requested.isBefore(dayjs())) {
      return res.status(400).json({ error: 'No puedes reservar en el pasado' });
    }

    // 4) Comprobar hora libre
    const conflict = db
      .prepare(`SELECT 1 FROM reservations WHERE worker_id = ? AND date = ? AND time = ?`)
      .get(worker_id, date, time);
    if (conflict) {
      return res.status(409).json({ error: 'Esa hora ya está reservada' });
    }

    // 5) Insertar sin user_id (no existe columna), pero con user_name/email
    const info = db.prepare(`
      INSERT INTO reservations
        (user_name, user_email, user_phone, service_id, worker_id, date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      user.name,
      user.email,
      user_phone,
      service_id,
      worker_id,
      date,
      time
    );

    return res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    console.error('Error al crear reserva:', err);
    return res.status(500).json({ error: 'Error al crear reserva', details: err.message });
  }
};

/**
 * Devuelve las reservas del trabajador logueado.
 */
exports.getReservationsByWorker = (req, res) => {
  const worker_id = req.user.id;
  if (req.user.role !== 'trabajador') {
    return res.status(403).json({ error: 'Sólo trabajadores pueden ver esto' });
  }

  try {
    const rows = db.prepare(`
      SELECT
        r.id,
        r.date,
        r.time,
        r.status,
        r.user_name,
        s.title AS service_title
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE r.worker_id = ?
      ORDER BY r.date, r.time
    `).all(worker_id);

    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener reservas del trabajador:', err);
    res.status(500).json({ error: 'Error al obtener reservas del trabajador' });
  }
};

/**
 * Devuelve las reservas del cliente logueado.
 */
exports.getReservationsByClient = (req, res) => {
  try {
    const userId = req.user.id;
    // volver a leer email
    const user = db
      .prepare('SELECT email FROM users WHERE id = ?')
      .get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // traer las reservas de ese email
    const rows = db.prepare(`
      SELECT
        r.id,
        r.date,
        r.time,
        s.title AS service_title,
        u.name  AS worker_name
      FROM reservations r
      JOIN services  s ON r.service_id = s.id
      JOIN users     u ON r.worker_id   = u.id
      WHERE r.user_email = ?
      ORDER BY r.date, r.time
    `).all(user.email);

    return res.json(rows);
  } catch (err) {
    console.error('Error al obtener historial del cliente:', err);
    return res.status(500).json({ error: 'Error interno al obtener tus reservas' });
  }
};

/**
 * Helper interno: calcula slots libres en base a disponibilidad y reservas.
 */
function getAvailableSlots(worker_id, date, service_duration) {
  const unavailable = db.prepare(`
    SELECT * FROM worker_unavailable_days
    WHERE worker_id = ? AND date = ?
  `).get(worker_id, date);
  if (unavailable) return [];

  const dayOfWeek = dayjs(date).format('dddd').toLowerCase();
  const avail = db.prepare(`
    SELECT start_time, end_time FROM worker_availability
    WHERE worker_id = ? AND day_of_week = ?
  `).get(worker_id, dayOfWeek);
  if (!avail) return [];

  const toMin = t => { const [h,m]=t.split(':').map(Number); return h*60+m };
  const toHHMM = m => {
    const h = Math.floor(m/60).toString().padStart(2,'0');
    const mm= (m%60).toString().padStart(2,'0');
    return `${h}:${mm}`;
  };

  const start = toMin(avail.start_time), end = toMin(avail.end_time);
  const booked = db.prepare(`
    SELECT time FROM reservations
    WHERE worker_id = ? AND date = ?
  `).all(worker_id, date).map(r => r.time);

  const slots = [];
  for (let t = start; t + service_duration <= end; t += service_duration) {
    const slot = toHHMM(t);
    if (!booked.includes(slot)) slots.push(slot);
  }
  return slots;
}

/**
 * Devuelve los slots disponibles para un trabajador dado.
 */
exports.getWorkerAvailability = (req, res) => {
  const { worker_id, date, service_duration } = req.query;
  if (!worker_id || !date || !service_duration) {
    return res.status(400).json({ error: 'Parámetros faltantes' });
  }
  const slots = getAvailableSlots(
    parseInt(worker_id, 10),
    date,
    parseInt(service_duration, 10)
  );
  res.json(slots);
};
