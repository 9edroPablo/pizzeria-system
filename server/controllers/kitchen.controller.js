const Order = require('../models/Order');

// GET /api/kitchen/orders - Cola de cocina: pagados primero, luego los más antiguos
exports.getKitchenOrders = async (req, res) => {
  try {
    const pedidos = await Order.find({
      estado: { $in: ['PENDIENTE', 'EN_PREPARACION'] },
    }).sort({ pagado: -1, createdAt: 1 });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la cola de cocina', error: error.message });
  }
};