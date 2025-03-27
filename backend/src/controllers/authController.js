const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './backend/src/.env' });

// Controlador para ruta de login
const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    let users = [];

    try {
        const rawData = fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf8');
        if (!rawData.trim()) {
            throw new Error('users.json is empty');
        }
        users = JSON.parse(rawData);
    } catch (err) {
        console.error('Error reading or parsing users.json:', err.message);
        return res.status(500).send('Error en el servidor al leer los usuarios');
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Simulate token generation (replace with real token logic in production)
        const token = 'fake-jwt-token';
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true en producción con HTTPS
            sameSite: 'Strict'
        });

        res.json({ message: 'Login successful' });
    } else {
        res.status(401).send('Invalid Credentials');
    }
};

// Controlador para ruta privada
const private = (req, res) => {
    if (req.user?.role === 'admin') {
        res.send('Privado para administradores');
    } else {
        res.status(403).send('Access denied');
    }
};

// Controlador para logout
const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // true en producción con HTTPS
        sameSite: 'Strict'
    });

    res.json({ message: 'Logout successful' });
};

module.exports = {
    login,
    private,
    logout
};
