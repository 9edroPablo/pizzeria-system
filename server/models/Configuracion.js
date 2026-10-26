const mongoose = require('mongoose');

const configuracionSchema = new mongoose.Schema({
  tienda_abierta: { type: Boolean, default: true },
  ubicacion: { type: String, default: '' }, // link de Google Maps de la pizzería
}, { timestamps: true });

module.exports = mongoose.model('Configuracion', configuracionSchema);