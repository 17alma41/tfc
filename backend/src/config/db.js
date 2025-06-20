const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, '../../../database.sqlite');
const db = new Database(dbPath /*, { fileMustExist: false } */);

db.prepare(`
  CREATE TABLE IF NOT EXISTS pending_users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    password    TEXT    NOT NULL,
    role        TEXT    CHECK(role IN ('superadmin','admin','encargado','trabajador','cliente')) DEFAULT 'cliente',
    token       TEXT    NOT NULL,
    created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Crear tabla usuarios si no exista
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('superadmin','admin','encargado','trabajador','cliente')) DEFAULT 'cliente',
    google_id TEXT
  )
`).run();

// Crear tabla servicios si no exista
db.prepare(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    duration INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    FOREIGN KEY(created_by) REFERENCES users(id)
  )
`).run();

// Crear tabla reservations si no exista, incluyendo status
db.prepare(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    service_id INTEGER NOT NULL,
    worker_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT CHECK(status IN ('active','cancelled')) DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(service_id) REFERENCES services(id),
    FOREIGN KEY(worker_id) REFERENCES users(id)
  )
`).run();

// Crear tabla disponibilidad semanal
db.prepare(`
  CREATE TABLE IF NOT EXISTS worker_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    FOREIGN KEY(worker_id) REFERENCES users(id)
  )
`).run();

// Crear tabla días no disponibles
db.prepare(`
  CREATE TABLE IF NOT EXISTS worker_unavailable_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    reason TEXT,
    FOREIGN KEY(worker_id) REFERENCES users(id)
  )
`).run();

module.exports = db;
