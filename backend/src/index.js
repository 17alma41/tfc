const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

require('dotenv').config({ path: './backend/src/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para permitir cookies desde el frontend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos desde la carpeta "public" (ubicada en raíz del proyecto)
// app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Ruta explícita para servir index.html desde public al acceder a "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});