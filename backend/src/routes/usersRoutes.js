const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Obtener todos los trabajadores
router.get('/workers', verifyToken, requireRole(['admin']), (req, res) => {
  try {
    const workers = db.prepare(`SELECT id, name, email FROM users WHERE role = 'trabajador'`).all();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener trabajadores' });
  }
});

// Obtener reservas por trabajador
router.get('/:id/reservations', verifyToken, requireRole(['admin']), (req, res) => {
  const worker_id = req.params.id;
  try {
    const reservations = db.prepare(`
      SELECT r.*, s.title AS service_title
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE r.worker_id = ?
      ORDER BY r.date, r.time
    `).all(worker_id);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// Actualizar datos de usuario
router.put('/:id', verifyToken, requireRole(['admin']), (req, res) => {
  const { name, email } = req.body;
  const id = req.params.id;
  try {
    db.prepare(`UPDATE users SET name = ?, email = ? WHERE id = ?`).run(name, email, id);
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
  const id = req.params.id;
  try {
    db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
