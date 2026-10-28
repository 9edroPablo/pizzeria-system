const Order = require('../models/Order');

// GET /api/orders/history - Pedidos ENTREGADOS y suma total de ventas
exports.getHistory = async (req, res) => {
  try {
    const pedidos = await Order.find({ estado: 'ENTREGADO' }).sort({ createdAt: -1 });
    const totalVentas = pedidos.reduce((suma, p) => suma + (p.total || 0), 0);
    res.status(200).json({ totalVentas, cantidad: pedidos.length, pedidos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el historial de ventas', error: error.message });
  }
};

// GET /api/orders/wait-time - 15 min base + 5 min por cada pedido activo (incluye LISTO)
exports.getWaitTime = async (req, res) => {
  try {
    const activos = await Order.countDocuments({
      estado: { $in: ['PENDIENTE', 'EN_PREPARACION', 'LISTO'] },
    });
    res.status(200).json({ pedidosActivos: activos, tiempoEstimadoMin: 15 + 5 * activos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al calcular el tiempo de espera', error: error.message });
  }
};