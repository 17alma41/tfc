const express = require('express');
const db = require('../config/db');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', verifyToken ,getProfile);

router.get('/admin-data', verifyToken, requireRole('admin'), (req, res) => {
    res.json({ message: 'Datos solo para administradores' });
});
  
router.get('/worker-data', verifyToken, requireRole('trabajador'), (req, res) => {
    res.json({ message: 'Datos solo para trabajadores' });
});

router.get('/workers', (req, res) => {
    try {
      const workers = db.prepare(`SELECT id, name FROM users WHERE role = 'trabajador'`).all();
      res.json(workers);
    } catch (err) {
      console.error('❌ Error al obtener trabajadores:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/users/workers', verifyToken, requireRole(['admin']), (req, res) => {
  try {
    const workers = db.prepare(`
      SELECT id, name, email FROM users WHERE role = 'trabajador'
    `).all();
    res.json(workers);
  } catch (err) {
    console.error('Error al obtener trabajadores:', err);
    res.status(500).json({ error: 'Error al obtener trabajadores' });
  }
});

module.exports = router;
