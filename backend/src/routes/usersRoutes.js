const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Crear nuevo usuario (solo admin/superadmin)
router.post(
  '/',
  verifyToken,
  requireRole('superadmin', 'admin'),
  (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    if (!['superadmin','admin','encargado','trabajador','cliente'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    try {
      const hashed = bcrypt.hashSync(password, 10);
      const stmt = db.prepare(`
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `);
      const info = stmt.run(name, email, hashed, role);
      res.status(201).json({
        id:    info.lastInsertRowid,
        name,
        email,
        role
      });
    } catch (err) {
      console.error('❌ Error al crear usuario:', err);
      if (err.message.includes('UNIQUE constraint')) {
        return res.status(409).json({ error: 'Email ya registrado' });
      }
      res.status(500).json({ error: 'Error interno al crear usuario' });
    }
  }
);

// Listar TODOS los usuarios (GET /api/users/)
router.get(
  '/',
  verifyToken,
  requireRole('superadmin', 'admin'),
  (req, res) => {
    try {
      const users = db.prepare(`
        SELECT id, name, email, role
        FROM users
      `).all();
      res.json(users);
    } catch (err) {
      console.error('❌ Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }
);

//  Listar solo trabajadores (GET /api/users/workers)
router.get(
  '/workers',
  verifyToken,
  requireRole('superadmin', 'admin'),
  (req, res) => {
    try {
      const workers = db.prepare(`
        SELECT id, name, email
        FROM users
        WHERE role = 'trabajador'
      `).all();
      res.json(workers);
    } catch (err) {
      console.error('❌ Error al obtener trabajadores:', err);
      res.status(500).json({ error: 'Error al obtener trabajadores' });
    }
  }
);

// Ruta pública (sin autenticación)
router.get('/public-workers', (req, res) => {
  try {
    const workers = db.prepare(`SELECT id, name FROM users WHERE role = 'trabajador'`).all();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener trabajadores públicos' });
  }
});

//  Obtener reservas por trabajador (GET /api/users/:id/reservations)
router.get(
  '/:id/reservations',
  verifyToken,
  requireRole('superadmin', 'admin'),
  (req, res) => {
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
      console.error('❌ Error al obtener reservas:', err);
      res.status(500).json({ error: 'Error al obtener reservas' });
    }
  }
);

//  Actualizar datos de usuario (PUT /api/users/:id)
router.put(
  '/:id',
  verifyToken,
  requireRole('superadmin', 'admin'),
  (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;
    try {
      db.prepare(`UPDATE users SET name = ?, email = ? WHERE id = ?`)
        .run(name, email, id);
      res.json({ message: 'Usuario actualizado' });
    } catch (err) {
      console.error('❌ Error al actualizar usuario:', err);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }
);

//  Eliminar usuario y datos asociados (DELETE /api/users/:id)
router.delete(
  '/:id',
  verifyToken,
  requireRole('superadmin', 'admin'),
  (req, res) => {
    const id = req.params.id;
    try {
      db.prepare(`DELETE FROM reservations WHERE worker_id = ?`).run(id);
      db.prepare(`DELETE FROM worker_unavailable_days WHERE worker_id = ?`).run(id);
      db.prepare(`DELETE FROM worker_availability WHERE worker_id = ?`).run(id);
      db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
      res.json({ message: 'Usuario y datos asociados eliminados correctamente' });
    } catch (err) {
      console.error('❌ Error al eliminar usuario y datos asociados:', err);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
);

module.exports = router;
