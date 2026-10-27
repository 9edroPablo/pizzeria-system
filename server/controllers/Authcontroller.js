const Usuario = require('../models/User');
const manejarError = require('../utils/manejarError');

const registrar = async (req, res) => {
  try {

    const { nombre, correo, password } = req.body;

    const usuario = await Usuario.create({ nombre, correo, password });

    res.status(201).json({ mensaje: 'Registro exitoso', usuario });
  } catch (error) {
    manejarError(error, res, 'El correo ya está registrado');
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res
        .status(400)
        .json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    if (typeof correo !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ mensaje: 'Datos inválidos' });
    }

    const usuario = await Usuario.findOne({
      correo: correo.toLowerCase().trim(),
    }).select('+password');

    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json({ mensaje: 'Inicio de sesión exitoso', usuario });
  } catch (error) {
    manejarError(error, res);
  }
};

module.exports = { registrar, login };