const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = require('../config/mailer');
const { check, validationResult } = require('express-validator');

// Helper para crear JWT de autenticación
const createToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

/**
 * Registro de nuevo usuario con verificación de email.
 * Guarda en pending_users y envía email con enlace de confirmación.
 */
exports.register = async (req, res) => {
  // Validaciones de entrada
  await check('name', 'El nombre es obligatorio').notEmpty().run(req);
  await check('email', 'Debe ser un email válido').isEmail().run(req);
  await check('password', 'La contraseña debe tener al menos 6 caracteres')
    .isLength({ min: 6 })
    .run(req);
  if (req.body.role) {
    await check('role', 'Rol inválido')
      .isIn(['superadmin', 'admin', 'encargado', 'trabajador', 'cliente'])
      .run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  let assignedRole = 'cliente';

  // Control de creación de superadmin solo en dev
  if (role === 'superadmin') {
    if (process.env.NODE_ENV === 'development') {
      assignedRole = 'superadmin';
    } else {
      return res.status(403).json({ error: 'No autorizado para crear superadmin en producción' });
    }
  } else if (['admin', 'encargado', 'trabajador', 'cliente'].includes(role)) {
    assignedRole = role;
  }

  try {
    // Verificar que no exista en users ni en pending_users
    const existsUser = db.prepare('SELECT 1 FROM users WHERE email = ?').get(email);
    const existsPending = db.prepare('SELECT 1 FROM pending_users WHERE email = ?').get(email);
    if (existsUser || existsPending) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    // Generar token de verificación (expira en 1h)
    const token = jwt.sign({ name, email, role: assignedRole }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Hashear contraseña
    const hashed = bcrypt.hashSync(password, 10);

    // Guardar en pending_users
    db.prepare(
      `INSERT INTO pending_users (name, email, password, role, token)
       VALUES (?, ?, ?, ?, ?)`
    ).run(name, email, hashed, assignedRole, token);

    // URL de verificación
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Configurar y enviar email
    const mailOptions = {
      from: `"Soporte App" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Verifica tu correo electrónico',
      html: `<p>Hola ${name},</p>
             <p>Pincha <a href="${verifyUrl}">aquí</a> para activar tu cuenta.</p>
             <p>Este enlace expira en 1 hora.</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email de verificación enviado a:", email);
      return res.status(200).json({ message: 'Te hemos enviado un email de verificación.' });
    } catch (emailErr) {
      console.error("❌ Error al enviar email:", emailErr);
      return res.status(500).json({ error: 'No se pudo enviar el email de verificación.' });
    }

  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);
    return res.status(500).json({ error: 'Error interno al registrar' });
  }
};


/**
 * Verificación de email: mueve de pending_users a users tras confirmar token.
 */
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Falta token de verificación' });
  }

  try {
    // Buscar registro pendiente
    const pending = db.prepare('SELECT * FROM pending_users WHERE token = ?').get(token);
    if (!pending) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Insertar en tabla users
    const info = db.prepare(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`
    ).run(pending.name, pending.email, pending.password, pending.role);

    // Eliminar de pending_users
    db.prepare('DELETE FROM pending_users WHERE id = ?').run(pending.id);

    // Opcional: generar JWT automático y cookie
    const jwtToken = jwt.sign(
      { id: info.lastInsertRowid, role: pending.role, name: pending.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.cookie('token', jwtToken, { httpOnly: true, sameSite: 'Lax' });

    // Redirigir al login con parámetro de éxito
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=1`);
  } catch (err) {
    console.error('Error en verificación de email:', err);
    return res.status(500).json({ error: 'Error interno al verificar correo' });
  }
};

// Validaciones para login
exports.login = async (req, res) => {
  await check('email', 'Debe ser un email válido').isEmail().run(req);
  await check('password', 'La contraseña es obligatoria').notEmpty().run(req);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

  if (user.google_id && !user.password) {
    // El usuario existe pero sólo tiene google_id, sin password local
    return res.status(400).json({ error: 'Esta cuenta se creó con Google. Usa el botón "Entrar con Google".' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = createToken(user);
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax', maxAge: 24 * 60 * 60 * 1000 });
  res.json({ message: 'Login exitoso', role: user.role });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada' });
};

exports.getProfile = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Contraseña olvidada
// Validaciones para recuperar contraseña
exports.forgotPassword = [
  check('email', 'Debe ser un email válido').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email } = req.body;
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!user) return res.status(404).json({ error: 'Email no registrado' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const transporter = nodemailer.createTransport(
      process.env.NODE_ENV === 'production'
        ? { service: process.env.EMAIL_SERVICE, auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } }
        : { host: process.env.EMAIL_HOST, port: +process.env.EMAIL_PORT, secure: false,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } }
    );
    await transporter.sendMail({ to: email, subject: 'Recupera tu contraseña', html: `<p>Pincha aquí para resetear tu contraseña:<br/><a href="${resetUrl}">${resetUrl}</a></p>` });
    res.json({ message: 'Correo de recuperación enviado' });
  }
];

exports.resetPassword = [
  check('token', 'El token es obligatorio').notEmpty(),
  check('password', 'La nueva contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  check('confirmPassword', 'La confirmación es obligatoria').notEmpty(),
  check('confirmPassword').custom((val, { req }) => val === req.body.password ? true : Promise.reject('Las contraseñas no coinciden')),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { token, password } = req.body;
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const hashed = bcrypt.hashSync(password, 10);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, id);
      res.json({ message: 'Contraseña actualizada' });
    } catch { return res.status(400).json({ error: 'Token inválido o expirado' }); }
  }
];