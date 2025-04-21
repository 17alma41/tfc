const express = require('express');
const router = express.Router();
const controller = require('../controllers/unavailableDaysController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, requireRole(['trabajador']), controller.create);
router.get('/:worker_id', verifyToken, requireRole(['trabajador', 'admin']), controller.getByWorker);
router.delete('/:id', verifyToken, requireRole(['trabajador']), controller.remove);

module.exports = router;
