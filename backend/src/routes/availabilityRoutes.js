const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/:worker_id', verifyToken, requireRole(['admin', 'trabajador']), availabilityController.getByWorker);
router.post('/', verifyToken, requireRole(['admin', 'trabajador']), availabilityController.create);
router.put('/:id', verifyToken, requireRole(['admin', 'trabajador']), availabilityController.update);
router.delete('/:id', verifyToken, requireRole(['admin', 'trabajador']), availabilityController.remove);

module.exports = router;
