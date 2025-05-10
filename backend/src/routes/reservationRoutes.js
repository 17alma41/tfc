const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Crear reserva (cliente)
router.post('/', verifyToken, requireRole(['cliente']) ,reservationController.createReservation);

// Cancelar reserva 
router.delete('/:id', verifyToken, reservationController.cancelReservation);

// Ver reservas del trabajador logueado
router.get('/mine', verifyToken, requireRole(['trabajador']), reservationController.getReservationsByWorker);

// Ver reservas del cliente logueado
router.get('/client',verifyToken,requireRole(['cliente']), reservationController.getReservationsByClient);

// Disponibilidad del trabajador logueado 
router.get('/available-slots', reservationController.getWorkerAvailability);

module.exports = router;
