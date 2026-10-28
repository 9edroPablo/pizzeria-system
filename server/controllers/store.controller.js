const Configuracion = require('../models/Configuracion');

// Solo hay un documento de configuración; se crea si no existe
const obtenerConfig = async () => {
  let config = await Configuracion.findOne();
  if (!config) config = await Configuracion.create({});
  return config;
};

exports.getStatus = async (req, res) => {
  try {
    const config = await obtenerConfig();
    res.status(200).json({ tienda_abierta: config.tienda_abierta, ubicacion: config.ubicacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el estado de la tienda', error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { tienda_abierta, ubicacion } = req.body || {};
    if (tienda_abierta !== undefined && typeof tienda_abierta !== 'boolean') {
      return res.status(400).json({ mensaje: 'tienda_abierta debe ser true o false' });
    }
    const config = await obtenerConfig();
    if (tienda_abierta !== undefined) config.tienda_abierta = tienda_abierta;
    if (ubicacion !== undefined) config.ubicacion = ubicacion;
    await config.save();
    res.status(200).json({ tienda_abierta: config.tienda_abierta, ubicacion: config.ubicacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el estado de la tienda', error: error.message });
  }
};