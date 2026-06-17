const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getPerfil = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, iniciales, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error en getPerfil:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const updatePerfil = async (req, res) => {
  const { nombre, password_actual, password_nueva } = req.body;

  try {
    const userResult = await pool.query('SELECT id, password_hash FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const usuario = userResult.rows[0];
    const updates = {};

    if (nombre) {
      updates.nombre = nombre;
      updates.iniciales = (() => {
        const partes = nombre.trim().split(' ');
        if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
      })();
    }

    if (password_nueva) {
      if (!password_actual) {
        return res.status(400).json({ success: false, message: 'Debes proporcionar la contraseña actual' });
      }
      const valida = await bcrypt.compare(password_actual, usuario.password_hash);
      if (!valida) {
        return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
      }
      if (password_nueva.length < 6) {
        return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      }
      updates.password_hash = await bcrypt.hash(password_nueva, 12);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No se proporcionaron datos para actualizar' });
    }

    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), req.user.id];

    const result = await pool.query(
      `UPDATE users SET ${fields} WHERE id = $${values.length} RETURNING id, nombre, email, iniciales`,
      values
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error en updatePerfil:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getPresupuesto = async (req, res) => {
  const mes = req.query.mes || new Date().toISOString().substring(0, 7);

  try {
    const result = await pool.query(
      'SELECT id, mes, limite_total FROM presupuestos_mensuales WHERE user_id = $1 AND mes = $2',
      [req.user.id, mes]
    );

    return res.json({
      success: true,
      data: result.rows[0] || { mes, limite_total: 0 },
    });
  } catch (err) {
    console.error('Error en getPresupuesto:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const updatePresupuesto = async (req, res) => {
  const { mes, limite_total } = req.body;

  if (!mes || limite_total === undefined) {
    return res.status(400).json({ success: false, message: 'Mes y límite total son requeridos' });
  }

  if (parseFloat(limite_total) <= 0) {
    return res.status(400).json({ success: false, message: 'El límite total debe ser mayor a 0' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO presupuestos_mensuales (user_id, mes, limite_total)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, mes) DO UPDATE SET limite_total = EXCLUDED.limite_total
       RETURNING *`,
      [req.user.id, mes, limite_total]
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error en updatePresupuesto:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { getPerfil, updatePerfil, getPresupuesto, updatePresupuesto };
