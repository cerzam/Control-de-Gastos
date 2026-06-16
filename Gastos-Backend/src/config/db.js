const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then((client) => {
    console.log('Conexión a PostgreSQL establecida correctamente');
    client.release();
  })
  .catch((err) => {
    console.error('Error al conectar con PostgreSQL:', err.message);
    process.exit(-1);
  });

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PostgreSQL:', err.message);
  process.exit(-1);
});

module.exports = pool;
