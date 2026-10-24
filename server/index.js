const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Producto = require('./models/Product');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Pizzería funcionando correctamente 🍕' });
});

// Conexión a Base de Datos y arranque del servidor
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzeria_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
    return Producto.create({
        nombre: '  ', 
        descripcion: "Pizza de Peperoni", 
        precio: 239, 
        categoria: "Mini pizzas",  }); 
  })
  .then((productoGuardado) => {
    console.log('Guardado:', productoGuardado);          // recibe el documento creado
  })
  .catch((err) => console.error('❌ ERROR:', err));

  