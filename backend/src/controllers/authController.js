const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/src/.env' });

// Simulación de usuarios en la base de datos
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Controlador para iniciar sesión
const login = (req, res) => {
    const { username, password } = req.body;

    // Buscar usuario en la base de datos simulada
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Generar un token con el ID y rol del usuario
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid Credentials');
    }
};

console.log('SECRET_KEY:', process.env.SECRET_KEY);

module.exports = { login };