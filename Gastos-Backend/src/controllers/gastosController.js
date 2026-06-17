const pool = require('../config/db');

const getGastos = async (req, res) => {
  const { mes, categoria_id } = req.query;

  let query = `
    SELECT g.id, g.nombre, g.monto, g.fecha, g.hora, g.metodo_pago, g.nota, g.recurrente, g.created_at,
           c.id AS categoria_id, c.nombre AS categoria_nombre, c.color AS categoria_color, c.icono AS categoria_icono
    FROM gastos g
    LEFT JOIN categorias c ON g.categoria_id = c.id
    WHERE g.user_id = $1
  `;
  const params = [req.user.id];

  if (mes) {
    params.push(mes);
    query += ` AND TO_CHAR(g.fecha, 'YYYY-MM') = $${params.length}`;
  }

  if (categoria_id) {
    params.push(categoria_id);
    query += ` AND g.categoria_id = $${params.length}`;
  }

  query += ' ORDER BY g.fecha DESC, g.hora DESC';

  try {
    const result = await pool.query(query, params);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error en getGastos:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const createGasto = async (req, res) => {
  const { nombre, categoria_id, monto, fecha, hora, metodo_pago, nota, recurrente } = req.body;

  if (!nombre || !monto || !fecha) {
    return res.status(400).json({ success: false, message: 'Nombre, monto y fecha son requeridos' });
  }

  try {
    if (categoria_id) {
      const cat = await pool.query('SELECT id FROM categorias WHERE id = $1 AND user_id = $2', [categoria_id, req.user.id]);
      if (cat.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'La categoría no pertenece al usuario' });
      }
    }

    const inserted = await pool.query(
      `INSERT INTO gastos (user_id, nombre, categoria_id, monto, fecha, hora, metodo_pago, nota, recurrente)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [req.user.id, nombre, categoria_id || null, monto, fecha, hora || null, metodo_pago || null, nota || null, recurrente || false]
    );

    // FIX: devolver el gasto con JOIN a categorias
    const result = await pool.query(
      `SELECT g.id, g.nombre, g.monto, g.fecha, g.hora, g.metodo_pago, g.nota, g.recurrente, g.created_at,
              c.id AS categoria_id, c.nombre AS categoria_nombre, c.color AS categoria_color, c.icono AS categoria_icono
       FROM gastos g
       LEFT JOIN categorias c ON g.categoria_id = c.id
       WHERE g.id = $1`,
      [inserted.rows[0].id]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error en createGasto:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const updateGasto = async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria_id, monto, fecha, hora, metodo_pago, nota, recurrente } = req.body;

  try {
    const existe = await pool.query('SELECT id FROM gastos WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (existe.rows.length === 0) {
      // FIX: 403 en lugar de 404 (oculta si el recurso existe pero es de otro usuario)
      return res.status(403).json({ success: false, message: 'No tienes permiso para modificar este gasto' });
    }

    if (categoria_id) {
      const cat = await pool.query('SELECT id FROM categorias WHERE id = $1 AND user_id = $2', [categoria_id, req.user.id]);
      if (cat.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'La categoría no pertenece al usuario' });
      }
    }

    // FIX: todos los campos opcionales usan COALESCE para no pisar valores existentes
    const updated = await pool.query(
      `UPDATE gastos
       SET nombre      = COALESCE($1, nombre),
           categoria_id = COALESCE($2, categoria_id),
           monto       = COALESCE($3, monto),
           fecha       = COALESCE($4, fecha),
           hora        = COALESCE($5, hora),
           metodo_pago = COALESCE($6, metodo_pago),
           nota        = COALESCE($7, nota),
           recurrente  = COALESCE($8, recurrente)
       WHERE id = $9 AND user_id = $10
       RETURNING id`,
      [
        nombre        || null,
        categoria_id  || null,
        monto         || null,
        fecha         || null,
        hora          || null,
        metodo_pago   || null,
        nota          || null,
        recurrente    ?? null,   // ?? para no perder el valor false
        id,
        req.user.id
      ]
    );

    // FIX: devolver el gasto actualizado con JOIN a categorias
    const result = await pool.query(
      `SELECT g.id, g.nombre, g.monto, g.fecha, g.hora, g.metodo_pago, g.nota, g.recurrente, g.created_at,
              c.id AS categoria_id, c.nombre AS categoria_nombre, c.color AS categoria_color, c.icono AS categoria_icono
       FROM gastos g
       LEFT JOIN categorias c ON g.categoria_id = c.id
       WHERE g.id = $1`,
      [updated.rows[0].id]
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error en updateGasto:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const deleteGasto = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM gastos WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.user.id]);

    if (result.rows.length === 0) {
      // FIX: 403 en lugar de 404
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este gasto' });
    }

    // FIX: devolver mensaje de confirmación
    return res.json({ success: true, message: 'Gasto eliminado correctamente' });
  } catch (err) {
    console.error('Error en deleteGasto:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { getGastos, createGasto, updateGasto, deleteGasto };
