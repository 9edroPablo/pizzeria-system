// Menú de ejemplo con la misma forma que tendrá GET /api/menu.
// Los precios están en pesos mexicanos (MXN).
export const PIZZAS = Object.freeze([
  {
    id: 'pizza-margarita',
    nombre: 'Margarita D.O.P.',
    linea: 'Rosso Classico',
    descripcion:
      'Tomate San Marzano D.O.P., mozzarella fior di latte y albahaca fresca del día.',
    precio: 189,
    tamano: '32 cm',
    badge: 'D.O.P.',
    rating: 4.9,
    topping: 'margarita',
    disponible: true,
    ingredientes: ['Tomate San Marzano', 'Mozzarella', 'Albahaca'],
    vegetariana: true,
  },
  {
    id: 'pizza-pepperoni',
    nombre: 'Pepperoni Clásica',
    linea: 'Rosso Classico',
    descripcion:
      'Salsa de tomate San Marzano, mozzarella y doble pepperoni artesanal.',
    precio: 219,
    tamano: '32 cm',
    badge: 'Popular',
    rating: 4.9,
    topping: 'pepperoni',
    disponible: true,
    ingredientes: ['Tomate', 'Mozzarella', 'Pepperoni'],
    vegetariana: false,
  },
  {
    id: 'pizza-hawaiana',
    nombre: 'Hawaiana Bianca',
    linea: 'Bianca',
    descripcion:
      'Base blanca de mozzarella, jamón dulce y piña caramelizada al horno de leña.',
    precio: 209,
    tamano: '32 cm',
    badge: null,
    rating: 4.7,
    topping: 'hawaiana',
    disponible: true,
    ingredientes: ['Mozzarella', 'Jamón', 'Piña caramelizada'],
    vegetariana: false,
  },
  {
    id: 'pizza-cuatro-quesos',
    nombre: 'Cuatro Quesos',
    linea: 'Bianca',
    descripcion:
      'Mozzarella fior di latte, gorgonzola, parmesano y fontina sobre base blanca.',
    precio: 229,
    tamano: '32 cm',
    badge: 'Favorita',
    rating: 4.8,
    topping: 'quesos',
    disponible: true,
    ingredientes: ['Mozzarella', 'Gorgonzola', 'Parmesano', 'Fontina'],
    vegetariana: true,
  },
  {
    id: 'pizza-vegetariana',
    nombre: 'Vegetariana del Huerto',
    linea: 'Verde',
    descripcion:
      'Calabacín, pimiento asado, champiñones y aceituna negra con aceite de oliva.',
    precio: 199,
    tamano: '32 cm',
    badge: 'Veggie',
    rating: 4.7,
    topping: 'vegetariana',
    disponible: true,
    ingredientes: ['Calabacín', 'Pimiento', 'Champiñón', 'Aceituna'],
    vegetariana: true,
  },
  {
    id: 'pizza-mexicana',
    nombre: 'Mexicana Picante',
    linea: 'Piccante',
    descripcion:
      'Chorizo artesanal, jalapeño fresco, cebolla morada y un toque de cilantro.',
    precio: 215,
    tamano: '32 cm',
    badge: 'Picante',
    rating: 4.8,
    topping: 'mexicana',
    disponible: true,
    ingredientes: ['Chorizo', 'Jalapeño', 'Cebolla morada', 'Cilantro'],
    vegetariana: false,
  },
])

export const MENU_LINES = Object.freeze([
  'Todas',
  ...new Set(PIZZAS.map((pizza) => pizza.linea)),
])
