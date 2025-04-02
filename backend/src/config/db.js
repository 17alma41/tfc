const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// Crear tabla usuarios si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin', 'trabajador')) DEFAULT 'trabajador'
  )
`).run();

// Crear tabla servicios si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    duration INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )
`).run();

module.exports = db;
