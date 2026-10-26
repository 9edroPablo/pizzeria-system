const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Pizzería funcionando correctamente 🍕' });
});

// Rutas de la API (Tienda, Cocina y Reportes)
app.use('/api/store', require('./routes/store.routes'));
app.use('/api/kitchen', require('./routes/kitchen.routes'));
app.use('/api/orders', require('./routes/orderReports.routes'));

// Conexión a Base de Datos y arranque del servidor
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzeria_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));
