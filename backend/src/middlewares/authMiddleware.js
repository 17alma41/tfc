const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/src/.env' });

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};

module.exports = authMiddleware;
