const db = require('../config/db');
const { check, param, validationResult } = require('express-validator');

// Crear servicio
exports.createService = async (req, res) => {
  await check('title', 'El título es obligatorio').notEmpty().run(req);
  await check('description', 'La descripción es obligatoria').notEmpty().run(req);
  await check('price', 'El precio debe ser un número mayor que 0')
    .isFloat({ gt: 0 })
    .run(req);
  await check('duration', 'La duración debe ser un entero mayor que 0')
    .isInt({ gt: 0 })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, price, duration } = req.body;
    const created_by = req.user.id;

    const stmt = db.prepare(`
      INSERT INTO services (title, description, price, duration, created_by)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, description, price, duration, created_by);

    res
      .status(201)
      .json({ id: result.lastInsertRowid, title, description, price, duration });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error al crear servicio', details: err.message });
  }
};

// Obtener todos los servicios
exports.getServices = (req, res) => {
  try {
    const services = db.prepare(`SELECT * FROM services`).all();
    res.json(services);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error al obtener servicios', details: err.message });
  }
};

// Actualizar servicio
exports.updateService = async (req, res) => {
  await param('id', 'id debe ser un entero').isInt().run(req);
  await check('title').optional().notEmpty().run(req);
  await check('description').optional().notEmpty().run(req);
  await check('price', 'El precio debe ser un número')
    .optional()
    .isFloat({ gt: 0 })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, price } = req.body;

  try {
    const stmt = db.prepare(
      `UPDATE services SET title = ?, description = ?, price = ? WHERE id = ? AND created_by = ?`
    );
    const result = stmt.run(title, description, price, id, req.user.id);

    if (result.changes === 0) {
      return res
        .status(403)
        .json({ error: 'No tienes permisos para actualizar este servicio' });
    }

    res.json({ message: 'Servicio actualizado correctamente' });
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error al actualizar servicio', details: err.message });
  }
};

// Eliminar servicio
exports.deleteService = async (req, res) => {
  await param('id', 'id debe ser un entero').isInt().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const stmt = db.prepare(
      `DELETE FROM services WHERE id = ? AND created_by = ?`
    );
    const result = stmt.run(id, req.user.id);

    if (result.changes === 0) {
      return res
        .status(403)
        .json({ error: 'No tienes permisos para eliminar este servicio' });
    }

    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error al eliminar servicio', details: err.message });
  }
};
