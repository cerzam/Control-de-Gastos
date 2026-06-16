const pool = require('../config/db');

const getCategorias = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, color, icono FROM categorias WHERE user_id = $1 ORDER BY nombre',
      [req.user.id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error en getCategorias:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const createCategoria = async (req, res) => {
  const { nombre, color, icono } = req.body;

  if (!nombre) {
    return res.status(400).json({ success: false, message: 'El nombre de la categoría es requerido' });
  }

  try {
    const duplicada = await pool.query(
      'SELECT id FROM categorias WHERE user_id = $1 AND LOWER(nombre) = LOWER($2)',
      [req.user.id, nombre]
    );
    if (duplicada.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' });
    }

    const result = await pool.query(
      'INSERT INTO categorias (user_id, nombre, color, icono) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, nombre, color || null, icono || null]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error en createCategoria:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM categorias WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    return res.json({ success: true, data: { id: result.rows[0].id } });
  } catch (err) {
    console.error('Error en deleteCategoria:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { getCategorias, createCategoria, deleteCategoria };
