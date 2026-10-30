const mongoose = require('mongoose');

const CATEGORIAS = ['PIZZA', 'BEBIDA', 'COMPLEMENTO'];

const productoSchema = new mongoose.Schema(
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
      uppercase: true, 
      trim: true,
      enum: {
        values: CATEGORIAS,
        message: '{VALUE} no es una categoría válida.',
      },
    },
    imagen_url: { type: String, trim: true, default: '' },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productoSchema.index({ categoria: 1, disponible: 1 });

productoSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// El nombre del modelo ('Product') es el que usan los ref de Order.js.
// El 3er argumento fija la colección en Atlas: sin él Mongoose usaría 'products'
// y los productos ya guardados en 'productos' quedarían huérfanos.
const Producto = mongoose.model('Product', productoSchema, 'productos');

module.exports = Producto;
module.exports.CATEGORIAS = CATEGORIAS;