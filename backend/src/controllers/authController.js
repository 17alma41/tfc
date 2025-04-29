const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  let assignedRole = 'cliente';

  // Si piden superadmin, solo en dev y con secret
  if (role === 'superadmin') {
    if (process.env.NODE_ENV === 'development') {
      assignedRole = 'superadmin';
    } else {
      return res.status(403).json({ error: 'No autorizado para crear superadmin en producción' });
    }
    } else if (['admin','encargado','trabajador','cliente'].includes(role)) {
      assignedRole = role;
    }

  const hashed = bcrypt.hashSync(password, 10);
  try {
    db.prepare(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`
    ).run(name, email, hashed, assignedRole);
    res.status(201).json({ message: 'Usuario registrado', role: assignedRole });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }
    res.status(500).json({ error: 'Error interno al registrar' });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = createToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 24 * 60 * 60 * 1000
  });

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
    const user = db.prepare(`SELECT id, name, email, role FROM users WHERE id = ?`).get(decoded.id);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user); // devolvemos solo los campos necesarios
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};  


