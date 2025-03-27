const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/login', authController.login);
router.get('/private', authMiddleware, roleMiddleware('admin'), authController.private);
router.post('/logout', authController.logout);

router.get('/login', (req, res) => {
    res.status(405).send('Method Not Allowed');
});

module.exports = router;
