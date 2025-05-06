const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// Crear tabla usuarios si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('superadmin', 'admin', 'encargado', 'trabajador', 'cliente')) DEFAULT 'cliente'
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

// Crear tabla reservations si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS reservations (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name    TEXT    NOT NULL,
    user_email   TEXT    NOT NULL,
    user_phone   TEXT    NOT NULL,
    service_id   INTEGER NOT NULL,
    worker_id    INTEGER NOT NULL,
    date         TEXT    NOT NULL,
    time         TEXT    NOT NULL,
    created_at   TEXT    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (worker_id)  REFERENCES users(id)
  )
`).run();

// Tabla: disponibilidad semanal del trabajador (ej: lunes: 09:00–14:00)
db.prepare(`
  CREATE TABLE IF NOT EXISTS worker_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER NOT NULL,
    day_of_week TEXT NOT NULL, -- Ej: 'monday', 'tuesday'
    start_time TEXT NOT NULL,  -- Ej: '09:00'
    end_time TEXT NOT NULL,    -- Ej: '14:00'
    FOREIGN KEY (worker_id) REFERENCES users(id)
  )
`).run();

// Tabla: días no disponibles del trabajador
db.prepare(`
  CREATE TABLE IF NOT EXISTS worker_unavailable_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- formato ISO: YYYY-MM-DD
    reason TEXT,
    FOREIGN KEY (worker_id) REFERENCES users(id)
  )
`).run();

module.exports = db;
