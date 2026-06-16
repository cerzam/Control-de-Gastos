require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const gastosRoutes = require('./routes/gastos');
const categoriasRoutes = require('./routes/categorias');
const dashboardRoutes = require('./routes/dashboard');
const configuracionRoutes = require('./routes/configuracion');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/usuario', configuracionRoutes);
app.use('/api/configuracion', configuracionRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API funcionando' }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
