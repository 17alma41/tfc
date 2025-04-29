const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/:worker_id', verifyToken, requireRole(['admin', 'trabajador', 'superadmin']), availabilityController.getByWorker);
router.post('/', verifyToken, requireRole(['admin', 'trabajador', 'superadmin']), availabilityController.create);
router.put('/:id', verifyToken, requireRole(['admin', 'trabajador', 'superadmin']), availabilityController.update);
router.delete('/:id', verifyToken, requireRole(['admin', 'trabajador', 'superadmin']), availabilityController.remove);

module.exports = router;
