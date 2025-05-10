const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
  process.env.NODE_ENV === 'production'
    ? {
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    : {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
);

transporter.verify((err, success) => {
  if (err) console.error('❌ SMTP verify failed:', err);
  else     console.log('✅ SMTP listo para enviar correos');
});

module.exports = transporter;
