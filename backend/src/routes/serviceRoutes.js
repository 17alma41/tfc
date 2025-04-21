const express = require('express');
const db = require('../config/db');
const router = express.Router();
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createService);

router.get('/', (req, res) => {
    try {
      const services = db.prepare(`SELECT * FROM services`).all();
      res.json(services);
    } catch (err) {
      console.error('❌ Error al obtener servicios:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});
  

router.put('/:id', verifyToken, updateService);
router.delete('/:id', verifyToken, deleteService);

module.exports = router;