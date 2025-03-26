/**
 * Middleware para verificar el rol del usuario.
 *
 * @param {string} requiredRole - El rol requerido para acceder al recurso.
 * @returns {Function} Middleware que verifica si el usuario tiene el rol requerido.
 */

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