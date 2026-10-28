const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const orderRoutes = require('./routes/orderRoutes');
const orderReportsRoutes = require('./routes/orderReports.routes');
const storeRoutes = require('./routes/store.routes');
const kitchenRoutes = require('./routes/kitchen.routes');
const menuRoutes = require('./routes/menu');
const authRoutes = require('./routes/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Pizzería funcionando correctamente 🍕' });
});

// Rutas de la API completas (Sprints 1 al 5)
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderReportsRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);

// Conexión a Base de Datos y arranque del servidor
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzeria_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));
