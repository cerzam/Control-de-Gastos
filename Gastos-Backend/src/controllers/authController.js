const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generarIniciales = (nombre) => {
  const partes = nombre.trim().split(' ');
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const generarToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ success: false, message: 'Nombre, email y contraseña son requeridos' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const existe = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'El email ya está registrado' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const iniciales = generarIniciales(nombre);

    const result = await pool.query(
      'INSERT INTO users (nombre, email, password_hash, iniciales) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, iniciales',
      [nombre, email, password_hash, iniciales]
    );

    const usuario = result.rows[0];
    const token = generarToken(usuario.id);

    return res.status(201).json({
      success: true,
      data: { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, iniciales: usuario.iniciales } },
    });
  } catch (err) {
    console.error('Error en register:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
  }

  try {
    const result = await pool.query(
      'SELECT id, nombre, email, password_hash, iniciales FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const token = generarToken(usuario.id);

    return res.json({
      success: true,
      data: {
        token,
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, iniciales: usuario.iniciales },
      },
    });
  } catch (err) {
    console.error('Error en login:', err.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { register, login };
