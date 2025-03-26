const express = require('express');
const authMiddleware = require('./middlewares/authMiddleware.js');
const roleMiddleware = require('./middlewares/roleMiddleware.js');
const { login } = require('./controllers/authController.js');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware para parsear JSON

app.post('/login', login); // Prueba para obtener el token

app.use(authMiddleware);

app.get('/', (req, res) => {
    res.send('Hola!');
});

app.get('/private', roleMiddleware('admin'), (req, res) => {
    res.send('Privado para administradores');
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});