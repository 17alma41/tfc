const express = require('express');
require('dotenv').config({ path: __dirname + '/../.env' });
require('./config/passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const unavailableDaysRoutes = require('./routes/unavailableDaysRoutes');
const usersRoutes = require('./routes/usersRoutes');
require('./config/db'); // crea tabla

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: process.env.NODE_ENV === 'production' } // Cookies seguras solo en producción
  })
);

// Inicializa Passport para manejar OAuth
app.use(passport.initialize());


app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/unavailable-days', unavailableDaysRoutes);
app.use('/api/users', usersRoutes);

// Ruta opcional para test
app.get('/', (req, res) => {
  res.send('API funcionando ✅');
});

console.log('SECRET JWT:', process.env.JWT_SECRET);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));
