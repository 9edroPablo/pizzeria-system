const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['CLIENTE', 'MOSTRADOR', 'COCINA', 'ADMIN'];

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: false,
      default: 'Cliente Pizzería',
      trim: true,
      maxlength: [80, 'El nombre es muy largo'],
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo no válido'],
    },
    // Opcional: el Checkout puede registrar a un cliente solo con su correo.
    // Si se envía una contraseña, debe tener al menos 8 caracteres
    // (minlength no se evalúa cuando el campo no viene).
    password: {
      type: String,
      required: false,
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false,
    },
    rol: {
      type: String,
      uppercase: true,
      enum: {
        values: ROLES,
        message: '{VALUE} no es un rol válido.',
      },
      default: 'CLIENTE',
    },
  },
  { timestamps: true }
);

usuarioSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

usuarioSchema.methods.compararPassword = function (passwordIngresada) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(passwordIngresada, this.password);
};

usuarioSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// El nombre del modelo ('User') es el que usan los ref de Order.js.
// El 3er argumento fija la colección en Atlas: sin él Mongoose usaría 'users'
// y los usuarios ya guardados en 'usuarios' quedarían huérfanos.
const Usuario = mongoose.model('User', usuarioSchema, 'usuarios');

module.exports = Usuario;
module.exports.ROLES = ROLES;