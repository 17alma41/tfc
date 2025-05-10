const express = require('express');
const db = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken');  
const { forgotPassword, resetPassword, register, login, logout, getProfile, verifyEmail } = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const passport = require('passport')
//const { roleToPath } = require('../config/roleMap');;

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', verifyToken ,getProfile);

router.get('/admin-data', verifyToken, requireRole('admin'), (req, res) => {
    res.json({ message: 'Datos solo para administradores' });
});
  
router.get('/worker-data', verifyToken, requireRole('trabajador'), (req, res) => {
    res.json({ message: 'Datos solo para trabajadores' });
});

router.get('/users', (req, res) => {
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

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Inicia flujo OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Genera tu JWT
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    // Manda cookie y redirige al front
    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

    //const frontendRole = roleToPath[req.user.role] || req.user.role; 
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

module.exports = router;
