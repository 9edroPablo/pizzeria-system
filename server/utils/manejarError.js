//   400 -> { mensaje, errores: { campo: "texto" } }
//   409 -> { mensaje }   (valor duplicado, error code 11000)
//   500 -> { mensaje }
const manejarError = (error, res, mensajeDuplicado = 'El registro ya existe') => {
  if (error.name === 'ValidationError') {
    const errores = {};
    for (const campo in error.errors) {
      errores[campo] = error.errors[campo].message;
    }
    return res.status(400).json({ mensaje: 'Datos inválidos', errores });
  }

  if (error.code === 11000) {
    return res.status(409).json({ mensaje: mensajeDuplicado });
  }

  console.error(error);
  return res.status(500).json({ mensaje: 'Error del servidor' });
};

module.exports = manejarError;