// Datos de ejemplo mientras Marco (menú) e Isaías (estado de tienda)
// terminan sus endpoints. Los campos se eligieron para que coincidan
// con lo que devolverá la API; si difieren, se adaptan en los servicios.

export const PIZZAS = [
  {
    id: 'pepperoni',
    nombre: 'Pepperoni Clásica',
    linea: 'Rosso Classico',
    descripcion:
      'Salsa de tomate San Marzano, mozzarella fior di latte y doble pepperoni artesanal.',
    precio: 10.0,
    tamano: '32 cm',
    badge: 'Popular',
    rating: 4.9,
    topping: 'pepperoni',
  },
  {
    id: 'margarita',
    nombre: 'Margarita D.O.P.',
    linea: 'Rosso Classico',
    descripcion:
      'Tomate San Marzano D.O.P., mozzarella fior di latte y albahaca fresca del día.',
    precio: 8.5,
    tamano: '32 cm',
    badge: 'D.O.P.',
    rating: 4.8,
    topping: 'margarita',
  },
  {
    id: 'hawaiana',
    nombre: 'Hawaiana Bianca',
    linea: 'Bianca',
    descripcion:
      'Base blanca de mozzarella, jamón dulce y piña caramelizada al horno de leña.',
    precio: 9.0,
    tamano: '32 cm',
    badge: 'Bianca',
    rating: 4.7,
    topping: 'hawaiana',
  },
  {
    id: 'cuatro-quesos',
    nombre: 'Cuatro Quesos',
    linea: 'Bianca',
    descripcion:
      'Mozzarella, gorgonzola, parmesano y provolone con un toque de miel de azahar.',
    precio: 10.5,
    tamano: '32 cm',
    badge: 'Bianca',
    rating: 4.9,
    topping: 'quesos',
  },
  {
    id: 'vegetariana',
    nombre: 'Vegetariana',
    linea: 'Verdure',
    descripcion:
      'Pimiento, calabacín, cebolla morada, champiñones y tomate cherry confitado.',
    precio: 9.5,
    tamano: '32 cm',
    badge: 'Veggie',
    rating: 4.6,
    topping: 'vegetariana',
  },
  {
    id: 'mexicana',
    nombre: 'Mexicana Picante',
    linea: 'Piccante',
    descripcion:
      'Chorizo artesanal, jalapeños, cebolla morada y un toque de salsa picante de la casa.',
    precio: 10.0,
    tamano: '32 cm',
    badge: 'Picante',
    rating: 4.8,
    topping: 'mexicana',
  },
]

export const TIENDA = {
  abierta: true,
  tiempoEspera: '90s',
  mensaje: 'Listo en 90s',
}
