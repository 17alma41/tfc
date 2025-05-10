const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Limita el número de peticiones por IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5,
  message: { status: 'error', message: 'Demasiados intentos de reservas' }
});

// Crear reserva (cliente)
router.post('/', limiter, verifyToken, requireRole(['cliente']) ,reservationController.createReservation);

// Cancelar reserva  
router.delete('/:id',  limiter, verifyToken, reservationController.cancelReservation);

// Ver reservas del trabajador logueado
router.get('/mine', verifyToken, requireRole(['trabajador']), reservationController.getReservationsByWorker);

// Ver reservas del cliente logueado
router.get('/client', verifyToken,requireRole(['cliente']), reservationController.getReservationsByClient);

// Disponibilidad del trabajador logueado 
router.get('/available-slots', reservationController.getWorkerAvailability);

module.exports = router;
