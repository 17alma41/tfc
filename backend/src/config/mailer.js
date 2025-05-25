const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración para usar SendGrid por API (HTTPS, sin SMTP)
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.EMAIL_PASS_PROD
  }
});

// Verificación opcional
transporter.verify(err => {
  if (err) console.error('❌ Error al configurar SendGrid:', err);
  else console.log('✅ SendGrid listo para enviar correos');
});

module.exports = transporter;