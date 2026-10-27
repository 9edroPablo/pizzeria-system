
require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Product');

const productos = [
  // --- 5 pizzas ---
  { nombre: 'Pepperoni', descripcion: 'Clásica con pepperoni y queso mozzarella', precio: 129, categoria: 'PIZZA' },
  { nombre: 'Hawaiana', descripcion: 'Jamón y piña con queso mozzarella', precio: 135, categoria: 'PIZZA' },
  { nombre: 'Mexicana', descripcion: 'Chorizo, jalapeño, cebolla y frijoles', precio: 139, categoria: 'PIZZA' },
  { nombre: 'Cuatro Quesos', descripcion: 'Mozzarella, parmesano, gouda y queso crema', precio: 149, categoria: 'PIZZA' },
  { nombre: 'Vegetariana', descripcion: 'Pimiento, champiñón, cebolla, aceituna y jitomate', precio: 125, categoria: 'PIZZA' },

  // --- 3 bebidas ---
  { nombre: 'Refresco de cola 600 ml', descripcion: 'Bebida fría', precio: 25, categoria: 'BEBIDA' },
  { nombre: 'Agua de jamaica 500 ml', descripcion: 'Agua fresca natural', precio: 22, categoria: 'BEBIDA' },
  { nombre: 'Limonada mineral 500 ml', descripcion: 'Limonada con agua mineral', precio: 28, categoria: 'BEBIDA' },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => Producto.deleteMany({})) // borra SOLO la colección de productos
  .then(() => Producto.insertMany(productos)) // inserta todos de una vez
  .then((insertados) => console.log(`✅ Seed listo: ${insertados.length} productos insertados`))
  .catch((error) => console.error('❌ Error en el seed:', error.message))
  .finally(() => mongoose.disconnect()); // cierra la conexión para que el script termine