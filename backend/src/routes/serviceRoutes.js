const express = require('express');
const router = express.Router();
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createService);
router.get('/', verifyToken, getServices);
router.put('/:id', verifyToken, updateService);
router.delete('/:id', verifyToken, deleteService);

module.exports = router;