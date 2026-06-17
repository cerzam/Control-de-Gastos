const pool = require('../config/db');

const getDashboard = async (req, res) => {
  const mes = req.query.mes || new Date().toISOString().substring(0, 7); // YYYY-MM

  try {
    const [gastosResult, presupuestoResult, porCategoriaResult, recientesResult, tendenciaResult] = await Promise.all([
      pool.query(
        `SELECT COALESCE(SUM(monto), 0) AS total_mes,
                COUNT(*) AS cantidad_gastos
         FROM gastos
         WHERE user_id = $1 AND TO_CHAR(fecha, 'YYYY-MM') = $2`,
        [req.user.id, mes]
      ),
      pool.query(
        'SELECT limite_total FROM presupuestos_mensuales WHERE user_id = $1 AND mes = $2',
        [req.user.id, mes]
      ),
      pool.query(
        `SELECT c.id, c.nombre, c.color, c.icono,
                COALESCE(SUM(g.monto), 0) AS total,
                COUNT(g.id) AS cantidad
         FROM categorias c
         LEFT JOIN gastos g ON g.categoria_id = c.id
           AND g.user_id = $1
           AND TO_CHAR(g.fecha, 'YYYY-MM') = $2
         WHERE c.user_id = $1
         GROUP BY c.id, c.nombre, c.color, c.icono
         ORDER BY total DESC`,
        [req.user.id, mes]
      ),
      pool.query(
        `SELECT g.id, g.nombre, g.monto, g.fecha, g.hora, g.metodo_pago,
                c.nombre AS categoria_nombre, c.color AS categoria_color, c.icono AS categoria_icono
         FROM gastos g
         LEFT JOIN categorias c ON g.categoria_id = c.id
         WHERE g.user_id = $1
         ORDER BY g.fecha DESC, g.hora DESC
         LIMIT 5`,
        [req.user.id]
      ),
      pool.query(
        `SELECT TO_CHAR(fecha, 'YYYY-MM') AS mes, COALESCE(SUM(monto), 0) AS total
         FROM gastos
         WHERE user_id = $1
           AND fecha >= (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months')
         GROUP BY TO_CHAR(fecha, 'YYYY-MM')
         ORDER BY mes`,
        [req.user.id]
      ),
    ]);

    const totalMes = parseFloat(gastosResult.rows[0].total_mes);
    const cantidadGastos = parseInt(gastosResult.rows[0].cantidad_gastos);
    const presupuesto = presupuestoResult.rows[0] ? parseFloat(presupuestoResult.rows[0].limite_total) : null;

    return res.json({
      success: true,
      data: {
        mes,
        total_mes:      totalMes,
        cantidad_gastos: cantidadGastos,
        limite_total:   presupuesto ?? 0,
        porcentaje:     presupuesto ? Math.round((totalMes / presupuesto) * 100) : 0,
        ultimos_gastos: recientesResult.rows,
        por_categoria:  porCategoriaResult.rows,
        tendencia:      tendenciaResult.rows,
      },
    });
  } catch (err) {
    console.error('Error en getDashboard:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { getDashboard };
