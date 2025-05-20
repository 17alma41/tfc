const express = require('express');
require('dotenv').config({ path: __dirname + '/../.env' });
require('./config/passport');
require('./config/db');

const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const unavailableDaysRoutes = require('./routes/unavailableDaysRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

// Seguridad y optimización
app.use(helmet());              
app.use(compression());         

// Limita el número de peticiones por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 peticiones por IP
  message: 'Demasiadas peticiones, intenta de nuevo más tarde.'
});

app.use(limiter);

// Configuración de CORS
const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'http://localhost:8080', // si lo usas
  process.env.FRONTEND_URL, // por si lo defines en producción
].filter(Boolean);

// CORS restringido y con credenciales
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sesión segura
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // 24h limpia sesiones expiradas
  }),
  cookie: { maxAge: 86400000 }
}));

// Passport: inicializa y gestiona sesión
app.use(passport.initialize());
app.use(passport.session());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/unavailable-days', unavailableDaysRoutes);
app.use('/api/users', usersRoutes);

// Ruta raíz de test
app.get('/', (req, res) => {
  res.send('API funcionando ✅');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);  
  res.status(err.status || 500)
     .json({ status: 'error', message: 'Server Error' });
});

// Arranque
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
