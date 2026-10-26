const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  nombre: { type: String, required: [true, 'El nombre del producto es obligatorio'], trim: true },
  cantidad: { type: Number, required: [true, 'La cantidad es obligatoria'], min: 1 },
  precio: { type: Number, required: [true, 'El precio unitario es obligatorio'], min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  cliente_correo: { type: String, required: [true, 'El correo del cliente es obligatorio'], trim: true, lowercase: true },
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'El pedido debe contener al menos un producto'
    }
  },
  total: { type: Number, required: true, min: 0 },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO'],
    default: 'PENDIENTE'
  },
  metodo_pago: {
    type: String,
    enum: ['ANTICIPADO', 'TIENDA'],
    required: true
  },
  pagado: { type: Boolean, default: false }
}, { timestamps: true });

orderSchema.pre('validate', function() {
  if (this.items && this.items.length > 0 && !this.total) {
    this.total = this.items.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
  }
  if (this.isNew && this.metodo_pago === 'ANTICIPADO') {
    this.pagado = true;
  }
});

orderSchema.index({ estado: 1, createdAt: 1 });

module.exports = mongoose.model('Order', orderSchema);
