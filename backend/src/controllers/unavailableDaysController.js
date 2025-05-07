const db = require('../config/db');
const { check, param, validationResult } = require('express-validator');

// Crear un nuevo día no disponible
exports.create = async (req, res) => {
  await check('date', 'Date debe tener formato YYYY-MM-DD').isISO8601().run(req);
  await check('reason', 'La razón es obligatoria').notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { date, reason } = req.body;
  const worker_id = req.user.id;

  try {
    const existing = db
      .prepare(
        `SELECT * FROM worker_unavailable_days WHERE worker_id = ? AND date = ?`
      )
      .get(worker_id, date);

    if (existing) {
      return res
        .status(409)
        .json({ error: 'Ya existe un día marcado como no disponible' });
    }

    const stmt = db.prepare(
      `INSERT INTO worker_unavailable_days (worker_id, date, reason)
       VALUES (?, ?, ?)`
    );

    const result = stmt.run(worker_id, date, reason);
    res.status(201).json({ id: result.lastInsertRowid, date, reason });
  } catch (err) {
    res.status(500).json({
      error: 'Error al guardar el día no disponible',
      details: err.message
    });
  }
};

// Obtener días no disponibles de un trabajador
exports.getByWorker = async (req, res) => {
  await param('worker_id', 'worker_id debe ser un entero').isInt().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const worker_id = parseInt(req.params.worker_id, 10);

  try {
    const stmt = db.prepare(
      `SELECT * FROM worker_unavailable_days WHERE worker_id = ?`
    );
    const days = stmt.all(worker_id);
    res.json(days);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error al obtener días no disponibles' });
  }
};

// Eliminar un día no disponible
exports.remove = async (req, res) => {
  await param('id', 'id debe ser un entero').isInt().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = parseInt(req.params.id, 10);

  try {
    db.prepare(`DELETE FROM worker_unavailable_days WHERE id = ?`).run(id);
    res.json({ message: 'Día eliminado correctamente' });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error al eliminar el día', details: err.message });
  }
};
