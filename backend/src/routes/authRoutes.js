const express = require('express');
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

module.exports = router;
