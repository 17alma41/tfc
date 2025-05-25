const db = require('../config/db');
const { check, param, validationResult } = require('express-validator');

// Obtener disponibilidad por worker_id
exports.getByWorker = async (req, res) => {
  await param('worker_id', 'worker_id debe ser un entero').isInt().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const worker_id = parseInt(req.params.worker_id, 10);
  const data = db
    .prepare(`SELECT * FROM worker_availability WHERE worker_id = ?`)
    .all(worker_id);
  res.json(data);
};

// Crear slot de disponibilidad
exports.create = async (req, res) => {

  // Tomar el worker_id desde el token si no viene en el body
  const worker_id = req.user.id;
  req.body.worker_id = worker_id; // para validaciones

  await check('worker_id', 'worker_id debe ser un entero').isInt().run(req);
  await check('day_of_week', 'day_of_week debe ser un string válido')
    .isString()
    .run(req);
  await check('start_time', 'start_time debe tener formato HH:MM')
    .matches(/^\d{2}:\d{2}$/)
    .run(req);
  await check('end_time', 'end_time debe tener formato HH:MM')
    .matches(/^\d{2}:\d{2}$/)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { day_of_week, start_time, end_time } = req.body;
  const result = db
    .prepare(`
      INSERT INTO worker_availability (worker_id, day_of_week, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `)
    .run(worker_id, day_of_week, start_time, end_time);
  res.status(201).json({ id: result.lastInsertRowid });
};

// Actualizar slot
exports.update = async (req, res) => {
  await param('id', 'id debe ser un entero').isInt().run(req);
  await check('day_of_week', 'day_of_week debe ser un string válido').isString().run(req);
  await check('start_time', 'start_time debe tener formato HH:MM').matches(/^\d{2}:\d{2}$/).run(req);
  await check('end_time', 'end_time debe tener formato HH:MM').matches(/^\d{2}:\d{2}$/).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const id = parseInt(req.params.id, 10);
  const { day_of_week, start_time, end_time } = req.body;

  db.prepare(`
    UPDATE worker_availability
    SET day_of_week = ?, start_time = ?, end_time = ?
    WHERE id = ?
  `).run(day_of_week, start_time, end_time, id);

  res.json({ message: 'Actualizado' });
};

// Eliminar slot
exports.remove = async (req, res) => {
  await param('id', 'id debe ser un entero').isInt().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = parseInt(req.params.id, 10);
  db.prepare(`DELETE FROM worker_availability WHERE id = ?`).run(id);
  res.json({ message: 'Eliminado' });
};
