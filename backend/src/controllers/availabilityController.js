const db = require('../config/db');

exports.getByWorker = (req, res) => {
  const worker_id = req.params.worker_id;
  const data = db.prepare(`SELECT * FROM worker_availability WHERE worker_id = ?`).all(worker_id);
  res.json(data);
};

exports.create = (req, res) => {
  const { worker_id, day_of_week, start_time, end_time } = req.body;
  const result = db.prepare(`
    INSERT INTO worker_availability (worker_id, day_of_week, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `).run(worker_id, day_of_week, start_time, end_time);
  res.status(201).json({ id: result.lastInsertRowid });
};

exports.update = (req, res) => {
  const { day_of_week, start_time, end_time } = req.body;
  const id = req.params.id;
  db.prepare(`
    UPDATE worker_availability
    SET day_of_week = ?, start_time = ?, end_time = ?
    WHERE id = ?
  `).run(day_of_week, start_time, end_time, id);
  res.json({ message: 'Actualizado' });
};

exports.remove = (req, res) => {
  const id = req.params.id;
  db.prepare(`DELETE FROM worker_availability WHERE id = ?`).run(id);
  res.json({ message: 'Eliminado' });
};
