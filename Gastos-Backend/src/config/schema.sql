-- Ejecutar este archivo para inicializar la base de datos
-- psql -U postgres -d control_gastos -f src/config/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  iniciales     VARCHAR(5),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
  id      SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nombre  VARCHAR(100) NOT NULL,
  color   VARCHAR(20),
  icono   VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS gastos (
  id           SERIAL PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nombre       VARCHAR(200) NOT NULL,
  categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
  monto        DECIMAL(12, 2) NOT NULL,
  fecha        DATE NOT NULL,
  hora         TIME,
  metodo_pago  VARCHAR(50),
  nota         TEXT,
  recurrente   BOOLEAN DEFAULT false,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS presupuestos_mensuales (
  id           SERIAL PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mes          VARCHAR(7) NOT NULL,
  limite_total DECIMAL(12, 2) NOT NULL,
  UNIQUE (user_id, mes)
);
