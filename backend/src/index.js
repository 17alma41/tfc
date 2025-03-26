const authMiddleware = require('./middlewares/authMiddleware.js');
const roleMiddleware = require('./middlewares/roleMiddleware.js');
const express = require('express');

const app = express();
const port = 3000;

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