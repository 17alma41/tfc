const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization === 'my-secret-token') {
        req.user = { id: 1, role: 'admin' }; // Simula un usuario autenticado
        next(); // Usuario autenticado
    } else {
        res.status(401).send('Unauthorized');
    }
};

module.exports = authMiddleware;