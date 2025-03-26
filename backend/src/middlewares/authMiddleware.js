const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/src/.env' });
const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send('Unauthorized');
    }

    // Extraer únicamente el token de la cadena completa "Bearer <token>"
    const token = authorization.split(' ')[1]; 

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Agregar los datos del usuario al objeto `req`
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};

module.exports = authMiddleware;