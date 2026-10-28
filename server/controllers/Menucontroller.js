const Producto = require('../models/Product');
const manejarError = require('../utils/manejarError');

const { CATEGORIAS } = Producto;

const obtenerMenu = async (req, res) => {
  try {
    const filtro = {};

    if (req.query.categoria) {
      const categoria = String(req.query.categoria).toUpperCase();

      if (!CATEGORIAS.includes(categoria)) {
        return res
          .status(400)
          .json({ mensaje: `Categoría no válida: ${req.query.categoria}` });
      }
      filtro.categoria = categoria;
    }

    const productos = await Producto.find(filtro).sort({ categoria: 1, nombre: 1 });
    res.json(productos);
  } catch (error) {
    manejarError(error, res);
  }
};


const crearProducto = async (req, res) => {
  try {

    const { nombre, descripcion, precio, categoria, imagen_url, disponible } = req.body;

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen_url,
      disponible,
    });

    res.status(201).json(producto);
  } catch (error) {
    manejarError(error, res, 'Ya existe un producto con ese nombre');
  }
};

module.exports = { obtenerMenu, crearProducto };