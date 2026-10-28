const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const Producto = require('./models/Product');

const productos = [
  // --- 6 pizzas del diseño en Figma ---
  {
    nombre: 'Margherita D.O.P.',
    descripcion: 'Salsa de tomate San Marzano, mozzarella fresca, albahaca y aceite de oliva extra virgen',
    precio: 120,
    categoria: 'PIZZA',
    imagen_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80'
  },
  {
    nombre: 'Pepperoni',
    descripcion: 'Clásica con doble pepperoni crujiente y queso mozzarella fundido',
    precio: 129,
    categoria: 'PIZZA',
    imagen_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80'
  },
  {
    nombre: 'Cuatro Quesos',
    descripcion: 'Mezcla artesanal de mozzarella, parmesano, gorgonzola y gouda',
    precio: 149,
    categoria: 'PIZZA',
    imagen_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
  },
  {
    nombre: 'Vegetariana',
    descripcion: 'Pimiento morrón, champiñones frescos, cebolla morada, aceitunas negras y jitomate',
    precio: 125,
    categoria: 'PIZZA',
    imagen_url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80'
  },
  {
    nombre: 'Hawaiana',
    descripcion: 'Jamón horneado y piña caramelizada sobre base de queso mozzarella',
    precio: 135,
    categoria: 'PIZZA',
    imagen_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
  },
  {
    nombre: 'Mexicana',
    descripcion: 'Chorizo artesanal, rodajas de jalapeño, cebolla y toque de frijoles',
    precio: 139,
    categoria: 'PIZZA',
    imagen_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80'
  },

  // --- 3 bebidas ---
  {
    nombre: 'Refresco de cola 600 ml',
    descripcion: 'Bebida fría bien helada',
    precio: 25,
    categoria: 'BEBIDA',
    imagen_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80'
  },
  {
    nombre: 'Agua de jamaica 500 ml',
    descripcion: 'Infusión fresca natural de flor de jamaica',
    precio: 22,
    categoria: 'BEBIDA',
    imagen_url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80'
  },
  {
    nombre: 'Limonada mineral 500 ml',
    descripcion: 'Limonada recién exprimida con agua mineral',
    precio: 28,
    categoria: 'BEBIDA',
    imagen_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  },
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzeria_db';

mongoose
  .connect(MONGO_URI)
  .then(() => Producto.deleteMany({}))
  .then(() => Producto.insertMany(productos))
  .then((insertados) => console.log(`✅ Seed listo: ${insertados.length} productos insertados en MongoDB Atlas`))
  .catch((error) => console.error('❌ Error en el seed:', error.message))
  .finally(() => mongoose.disconnect());
