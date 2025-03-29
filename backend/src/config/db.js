const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin', 'trabajador')) DEFAULT 'trabajador'
  )
`).run();

module.exports = db;
