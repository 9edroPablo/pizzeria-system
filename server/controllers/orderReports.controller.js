const Order = require('../models/Order');
const Configuracion = require('../models/Configuracion');

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
    const config = await Configuracion.findOne();
    res.status(200).json({
      pedidosActivos: activos,
      tiempoEstimadoMin: 15 + 5 * activos,
      tienda_abierta: config?.tienda_abierta !== false,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al calcular el tiempo de espera', error: error.message });
  }
};

// GET /api/orders/:id - Consultar el estado de un pedido (pantalla "Pedido Confirmado")
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ mensaje: 'El id del pedido no es válido' });
    }
    const pedido = await Order.findById(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar el pedido', error: error.message });
  }
};