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
    password: {
      type: String,
      required: false,
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

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
module.exports.ROLES = ROLES;
