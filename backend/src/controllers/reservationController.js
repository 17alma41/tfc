const db = require('../config/db');
const dayjs = require('dayjs');
const transporter = require('../config/mailer');
const { check, param, query, validationResult } = require('express-validator');

/**
 * Crea una reserva. Sólo clientes.
 */
exports.createReservation = async (req, res) => {
  // Validar campos de entrada
  await check('service_id', 'service_id debe ser un entero').isInt().run(req);
  await check('worker_id', 'worker_id debe ser un entero').isInt().run(req);
  await check('date', 'Date debe tener formato YYYY-MM-DD').isISO8601().run(req);
  await check('time', 'Time debe tener formato HH:MM').matches(/^\d{2}:\d{2}$/).run(req);
  await check('user_phone', 'El teléfono del usuario es obligatorio').notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { service_id, worker_id, date, time, user_phone } = req.body;
    const userId = req.user.id; // de verifyToken

    // Traer nombre y email reales del usuario
    const user = db
      .prepare('SELECT name, email FROM users WHERE id = ?')
      .get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const requested = dayjs(`${date}T${time}`);
    if (requested.isBefore(dayjs())) {
      return res.status(400).json({ error: 'No puedes reservar en el pasado' });
    }

    // Comprobar hora libre
    const conflict = db
      .prepare(
        `SELECT 1 FROM reservations WHERE worker_id = ? AND date = ? AND time = ?`
      )
      .get(worker_id, date, time);
    if (conflict) {
      return res.status(409).json({ error: 'Esa hora ya está reservada' });
    }

    // Insertar reserva
    const info = db
      .prepare(`
        INSERT INTO reservations
          (user_name, user_email, user_phone, service_id, worker_id, date, time)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        user.name,
        user.email,
        user_phone,
        service_id,
        worker_id,
        date,
        time
      );

     
    // Fetch emails: cliente y trabajador
    const worker = db
      .prepare(`SELECT name, email FROM users WHERE id = ?`)
      .get(worker_id);

    // Opciones de email para el cliente
    const mailToClient = {
      from: `"Soporte App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Confirmación de tu reserva',
      html: `
        <p>Hola ${user.name},</p>
        <p>Tu reserva para <strong>${service.title}</strong> el ${date} a las ${time} ha sido confirmada.</p>
        <p>Trabajador asignado: ${worker.name} (${worker.email}).</p>
      `
    };

    // Opciones de email para el trabajador
    const mailToWorker = {
      from: `"Soporte App" <${process.env.EMAIL_USER}>`,
      to: worker.email,
      subject: 'Nueva reserva asignada',
      html: `
        <p>Hola ${worker.name},</p>
        <p>Se ha realizado una nueva reserva:</p>
        <ul>
          <li>Cliente: ${user.name} (${user.email})</li>
          <li>Servicio: ${service.title}</li>
          <li>Fecha y hora: ${date} a las ${time}</li>
          <li>Teléfono cliente: ${user_phone}</li>
        </ul>
      `
    };

    // Enviar ambos correos en paralelo
    Promise.all([
      transporter.sendMail(mailToClient),
      transporter.sendMail(mailToWorker)
    ]).catch(err =>
      console.error('Error enviando confirmaciones:', err)
    );

    return res.status(201).json({ id: info.lastInsertRowid });

  } catch (err) {
    console.error('Error al crear reserva:', err);
    return res
      .status(500)
      .json({ error: 'Error al crear reserva', details: err.message });
  }
};

/**
 * Cancela una reserva. Sólo trabajadores.
 */
exports.cancelReservation = async (req, res) => {
  await param('id', 'id debe ser un entero').isInt().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const reservationId = Number(req.params.id);
    const userId        = req.user.id;
    const userEmail     = req.user.email;
    const userRole      = req.user.role;

    // Obtener reserva
    const reservation = db
      .prepare(`SELECT * FROM reservations WHERE id = ?`)
      .get(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // No permitir cancelar reservas pasadas
    const reservedAt = dayjs(`${reservation.date}T${reservation.time}`);
    if (reservedAt.isBefore(dayjs())) {
      return res.status(400).json({ error: 'No puedes cancelar una reserva pasada' });
    }

    // Autorizar: cliente dueño o trabajador asignado
    const isClient  = userRole === 'cliente'   && reservation.user_email === userEmail;
    const isWorker  = userRole === 'trabajador' && reservation.worker_id === userId;
    if (!isClient && !isWorker) {
      return res.status(403).json({ error: 'No autorizado para cancelar esta reserva' });
    }

    // Borrar reserva
    db.prepare(`DELETE FROM reservations WHERE id = ?`).run(reservationId);

    // Fetch datos para correos
    const client = {
      name: reservation.user_name,
      email: reservation.user_email
    };
    const worker = db
      .prepare(`SELECT name, email FROM users WHERE id = ?`)
      .get(reservation.worker_id);

    // Email de cancelación para el cliente
    const mailToClient = {
      from: `"Soporte App" <${process.env.EMAIL_USER}>`,
      to: client.email,
      subject: 'Tu reserva ha sido cancelada',
      html: `
        <p>Hola ${client.name},</p>
        <p>Tu reserva para el día ${reservation.date} a las ${reservation.time} ha sido <strong>cancelada</strong>.</p>
        <p>Si necesitas más información, contactános.</p>
      `
    };

    // Email de cancelación para el trabajador
    const mailToWorker = {
      from: `"Soporte App" <${process.env.EMAIL_USER}>`,
      to: worker.email,
      subject: 'Reserva cancelada',
      html: `
        <p>Hola ${worker.name},</p>
        <p>La reserva para el día ${reservation.date} a las ${reservation.time},</p>
        <p>del cliente ${client.name} (${client.email}) ha sido cancelada.</p>
      `
    };

    // Enviar ambos correos
    Promise.all([
      transporter.sendMail(mailToClient),
      transporter.sendMail(mailToWorker)
    ]).catch(err =>
      console.error('Error enviando emails de cancelación:', err)
    );

    return res.json({ message: 'Reserva cancelada y notificados cliente y trabajador' });
  } catch (err) {
    console.error('Error al cancelar reserva:', err);
    return res.status(500).json({ error: 'Error al cancelar reserva', details: err.message });
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
    const cutoff = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const rows = db
      .prepare(
        `SELECT
           r.id,
           r.date,
           r.time,
           r.status,
           r.user_name,
           s.title AS service_title
         FROM reservations r
         JOIN services s ON r.service_id = s.id
         WHERE r.worker_id = ?
           AND r.date >= ?
         ORDER BY r.date, r.time`
      )
      .all(worker_id, cutoff);

    return res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener reservas del trabajador:', err);
    return res
      .status(500)
      .json({ error: 'Error al obtener reservas del trabajador' });
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
    const rows = db
      .prepare(`
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
      `)
      .all(user.email);

    return res.json(rows);
  } catch (err) {
    console.error('Error al obtener historial del cliente:', err);
    return res
      .status(500)
      .json({ error: 'Error interno al obtener tus reservas' });
  }
};

/**
 * Helper interno: calcula slots libres en base a disponibilidad y reservas.
 */
function getAvailableSlots(worker_id, date, service_duration) {
  const unavailable = db
    .prepare(`
      SELECT * FROM worker_unavailable_days
      WHERE worker_id = ? AND date = ?
    `)
    .get(worker_id, date);
  if (unavailable) return [];

  const dayOfWeek = dayjs(date).format('dddd').toLowerCase();
  const avail = db
    .prepare(`
      SELECT start_time, end_time FROM worker_availability
      WHERE worker_id = ? AND day_of_week = ?
    `)
    .get(worker_id, dayOfWeek);
  if (!avail) return [];

  const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m };
  const toHHMM = m => {
    const h = Math.floor(m / 60).toString().padStart(2, '0');
    const mm = (m % 60).toString().padStart(2, '0');
    return `${h}:${mm}`;
  };

  const start = toMin(avail.start_time);
  const end = toMin(avail.end_time);
  const booked = db
    .prepare(`
      SELECT time FROM reservations
      WHERE worker_id = ? AND date = ?
    `)
    .all(worker_id, date)
    .map(r => r.time);

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
exports.getWorkerAvailability = async (req, res) => {
  // Validar query params
  await query('worker_id', 'worker_id debe ser un entero').isInt().run(req);
  await query('date', 'Date debe tener formato YYYY-MM-DD').isISO8601().run(req);
  await query('service_duration', 'service_duration debe ser un entero').isInt().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { worker_id, date, service_duration } = req.query;
  const slots = getAvailableSlots(
    parseInt(worker_id, 10),
    date,
    parseInt(service_duration, 10)
  );
  return res.json(slots);
};
