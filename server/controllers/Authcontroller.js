const Usuario = require('../models/User');
const manejarError = require('../utils/manejarError');

const registrar = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body || {};

    if (!correo) {
      return res.status(400).json({ mensaje: 'El correo electrónico es obligatorio' });
    }

    const correoNormalizado = String(correo).toLowerCase().trim();

    // Si el cliente ya había comprado antes con ese correo, lo reutilizamos (Idempotente)
    let usuario = await Usuario.findOne({ correo: correoNormalizado });
    if (usuario) {
      return res.status(200).json({ mensaje: 'Cliente identificado correctamente', usuario });
    }

    // Si es primera vez que compra, lo creamos (nombre y password opcionales para Checkout rápido)
    usuario = await Usuario.create({
      nombre: nombre || correoNormalizado.split('@')[0],
      correo: correoNormalizado,
      ...(password ? { password } : {}),
    });

    res.status(201).json({ mensaje: 'Registro exitoso', usuario });
  } catch (error) {
    manejarError(error, res, 'Error al registrar el correo del cliente');
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body || {};

    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ correo: String(correo).toLowerCase().trim() }).select('+password');
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario });
  } catch (error) {
    manejarError(error, res);
  }
};

module.exports = { registrar, login };
