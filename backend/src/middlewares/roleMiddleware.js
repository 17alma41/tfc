const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;

        if (user && user.role === requiredRole) {
            next(); // Usuario autorizado
        } else {
            res.status(403).send('Forbidden');
        }
    };
};

module.exports = roleMiddleware;