const Usuario = require('../models/User');
const manejarError = require('../utils/manejarError');

const respuestaExistente = (res, usuario) =>
  res.status(200).json({
    mensaje: 'El usuario ya estaba registrado',
    existente: true,
    usuario: {
      _id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
    },
  });

// POST /api/auth/register  (idempotente)
const registrar = async (req, res) => {
  let correoNormalizado = null;

  try {
    const { nombre, correo, password } = req.body || {};

    if (correo !== undefined && typeof correo !== 'string') {
      return res
        .status(400)
        .json({ mensaje: 'Datos inválidos', errores: { correo: 'Correo no válido' } });
    }

    if (correo) {
      correoNormalizado = correo.toLowerCase().trim();
      const existente = await Usuario.findOne({ correo: correoNormalizado });
      if (existente) return respuestaExistente(res, existente);
    }

    // Un campo vacío ("" de un formulario sin llenar) se trata como "no enviado":
    // así aplica el nombre por defecto y no se exige longitud a una contraseña inexistente.
    const nombreFinal = typeof nombre === 'string' && nombre.trim() === '' ? undefined : nombre;
    const passwordFinal = password === '' ? undefined : password;

    const usuario = await Usuario.create({ nombre: nombreFinal, correo, password: passwordFinal });
    res.status(201).json({ mensaje: 'Registro exitoso', usuario });
  } catch (error) {
    if (error.code === 11000 && correoNormalizado) {
      try {
        const existente = await Usuario.findOne({ correo: correoNormalizado });
        if (existente) return respuestaExistente(res, existente);
      } catch (_) {
      }
    }
    manejarError(error, res, 'El correo ya está registrado');
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { correo, password } = req.body || {};

    if (!correo || !password) {
      return res
        .status(400)
        .json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    if (typeof correo !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ mensaje: 'Datos inválidos' });
    }

    // password tiene select:false, se pide explícitamente con "+password"
    const usuario = await Usuario.findOne({
      correo: correo.toLowerCase().trim(),
    }).select('+password');

    // Mismo mensaje si el correo no existe o si la contraseña está mal
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json({ mensaje: 'Inicio de sesión exitoso', usuario });
  } catch (error) {
    manejarError(error, res);
  }
};

module.exports = { registrar, login };