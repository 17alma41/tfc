const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('❌ Token no encontrado');
    return res.status(401).json({ error: 'No estás autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    //console.log('✅ Token válido. Usuario:', decoded);
    next();
  } catch (err) {
    console.log('❌ Token inválido');
    return res.status(403).json({ error: 'Token inválido' });
  }
};


exports.requireRole = (roles) => {
  return (req, res, next) => {
    //console.log('🔒 Comprobando rol, usuario:', req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para acceder a esta ruta' });
    }
    next();
  };
};

