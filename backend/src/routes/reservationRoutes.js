const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Crear reserva (pública)
router.post('/', verifyToken, requireRole(['cliente']) ,reservationController.createReservation);

// Disponibilidad del trabajador logueado 
router.get('/available-slots', reservationController.getWorkerAvailability);

// Ver reservas del trabajador logueado
router.get('/mine', verifyToken, requireRole(['trabajador']), reservationController.getReservationsByWorker);

// Ver reservas del cliente logueado
router.get(
    '/client',
    verifyToken,
    requireRole(['cliente']),
    reservationController.getReservationsByClient
);

module.exports = router;
