const nodemailer = require('nodemailer');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const transporter = nodemailer.createTransport({
  host: process.env[ isProd ? 'EMAIL_HOST_PROD' : 'EMAIL_HOST_DEV' ],
  port: Number(process.env[ isProd ? 'EMAIL_PORT_PROD' : 'EMAIL_PORT_DEV' ]),
  secure: false,               
  requireTLS: isProd,          
  auth: {
    user: process.env[ isProd ? 'EMAIL_USER_PROD' : 'EMAIL_USER_DEV' ],
    pass: process.env[ isProd ? 'EMAIL_PASS_PROD' : 'EMAIL_PASS_DEV' ]
  }
});

transporter.verify(err => {
  if (err) console.error('❌ SMTP verify failed:', err);
  else     console.log('✅ SMTP listo para enviar correos');
});

module.exports = transporter;