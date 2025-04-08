const express = require('express');
require('dotenv').config({ path: __dirname + '/../.env' });
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
require('./config/db'); // crea tabla

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/availability', availabilityRoutes);

// Ruta opcional para test
app.get('/', (req, res) => {
  res.send('API funcionando ✅');
});

console.log('SECRET JWT:', process.env.JWT_SECRET);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));
