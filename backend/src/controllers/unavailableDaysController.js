const db = require('../config/db');

// Crear un nuevo día no disponible
exports.create = (req, res) => {
  const { date, reason } = req.body;
  const worker_id = req.user.id;

  try {
    const existing = db.prepare(`
      SELECT * FROM worker_unavailable_days WHERE worker_id = ? AND date = ?
    `).get(worker_id, date);

    if (existing) {
      return res.status(409).json({ error: 'Ya existe un día marcado como no disponible' });
    }

    const stmt = db.prepare(`
      INSERT INTO worker_unavailable_days (worker_id, date, reason)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(worker_id, date, reason);
    res.status(201).json({ id: result.lastInsertRowid, date, reason });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el día no disponible', details: err.message });
  }
};

// Obtener los días no disponibles de un trabajador
exports.getByWorker = (req, res) => {
  const worker_id = req.params.worker_id;

  try {
    const stmt = db.prepare(`
      SELECT * FROM worker_unavailable_days WHERE worker_id = ?
    `);

    const days = stmt.all(worker_id);
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener días no disponibles' });
  }
};

// Eliminar un día no disponible
exports.remove = (req, res) => {
  const id = req.params.id;

  try {
    db.prepare(`DELETE FROM worker_unavailable_days WHERE id = ?`).run(id);
    res.json({ message: 'Día eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el día', details: err.message });
  }
};
