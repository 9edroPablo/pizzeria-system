const Order = require('../models/Order');
const Configuracion = require('../models/Configuracion');

// 1. POST /api/orders - Crear un nuevo pedido
exports.createOrder = async (req, res) => {
    try {
        const config = await Configuracion.findOne();

        if (config && config.tienda_abierta === false) {
            return res.status(400).json({
                mensaje: 'La pizzería se encuentra cerrada en este momento'
            });
        }

        const { cliente_correo, usuario_id, items, metodo_pago, total } = req.body || {};

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ mensaje: 'El pedido debe incluir al menos un producto' });
        }

        const nuevoPedido = new Order({
            cliente_correo,
            usuario_id,
            items,
            metodo_pago,
            total,
            pagado: metodo_pago === 'ANTICIPADO'
        });

        const pedidoGuardado = await nuevoPedido.save();
        res.status(201).json(pedidoGuardado);

    } catch (error) {
        const status = error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500;
        res.status(status).json({ mensaje: 'Error al crear el pedido', error: error.message });
    }
};

// 2. GET /api/orders/active - Pedidos activos para mostrador (no ENTREGADOS)
exports.getActiveOrders = async (req, res) => {
    try {
        const pedidosActivos = await Order.find({
            estado: { $ne: 'ENTREGADO' }
        }).sort({ createdAt: -1 });

        res.status(200).json(pedidosActivos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener pedidos activos', error: error.message });
    }
};

// 3. PATCH /api/orders/:id/pay - Marcar pedido como pagado (cobro en tienda)
exports.markAsPaid = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Order.findByIdAndUpdate(
            id,
            { pagado: true },
            { new: true }
        );

        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        res.status(200).json({ mensaje: 'Pedido marcado como pagado', pedido });
    } catch (error) {
        res.status(error.name === 'CastError' ? 400 : 500).json({ mensaje: 'Error al registrar pago', error: error.message });
    }
};

// 4. PATCH /api/orders/:id/status - Cambiar estado del pedido
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body || {};

        const estadosValidos = ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                mensaje: `Estado no válido. Opciones permitidas: ${estadosValidos.join(', ')}`
            });
        }

        const pedido = await Order.findById(id);

        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        if (estado === 'ENTREGADO' && pedido.pagado === false) {
            return res.status(400).json({
                mensaje: 'No se puede entregar un pedido sin registrar el cobro en tienda primero'
            });
        }

        pedido.estado = estado;
        await pedido.save();

        return res.status(200).json({ mensaje: 'Estado actualizado correctamente', pedido });
    } catch (error) {
        res.status(error.name === 'CastError' ? 400 : 500).json({ mensaje: 'Error al actualizar estado', error: error.message });
    }
};
