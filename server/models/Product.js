const mongoose = require('mongoose');

const CATEGORIAS = ['pizzas', 'entradas', 'bebidas', 'postres', 'complementos'];

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      unique: true,
      trim: true,
      minlength: [2, 'El nombre es muy corto'],
      maxlength: [80, 'El nombre es muy largo'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [300, 'La descripción no debe pasar de 300 caracteres'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: { values: CATEGORIAS, message: 'Categoría no válida: {VALUE}' },
      lowercase: true,
      trim: true,
    },
    disponible: { type: Boolean, default: true },
    imagen: { type: String, trim: true }, // URL opcional
  },
  { timestamps: true }
);

// Acelera el listado del menú filtrado por categoría y disponibilidad
productSchema.index({ categoria: 1, disponible: 1 });

productSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIAS = CATEGORIAS;