const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Crear reserva (pública)
router.post('/', reservationController.createReservation);

// Ver reservas del trabajador logueado
router.get('/mine', requireAuth, requireRole(['trabajador']), reservationController.getReservationsByWorker);

module.exports = router;
