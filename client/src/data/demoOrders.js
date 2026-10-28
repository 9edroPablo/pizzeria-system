// Pedidos de ejemplo para que seguimiento y cuenta tengan contenido
// mientras el backend de pedidos se conecta al cliente.
const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function getDemoOrders() {
  const now = Date.now()

  return [
    {
      id: 'FF-4892',
      estado: 'EN_PREPARACION',
      pagado: true,
      metodoPago: 'ANTICIPADO',
      creadoEn: new Date(now - 12 * MINUTE).toISOString(),
      tiempoEstimado: '25–35 min',
      clienteCorreo: 'ana.martinez@correo.mx',
      clienteTelefono: '55 4821 7390',
      notas: 'Sin albahaca en una de las pizzas, por favor.',
      items: [
        {
          productoId: 'pizza-margarita',
          nombre: 'Margarita D.O.P.',
          linea: 'Rosso Classico',
          tamano: '32 cm',
          topping: 'margarita',
          cantidad: 1,
          precio: 189,
        },
        {
          productoId: 'pizza-pepperoni',
          nombre: 'Pepperoni Clásica',
          linea: 'Rosso Classico',
          tamano: '32 cm',
          topping: 'pepperoni',
          cantidad: 1,
          precio: 219,
        },
      ],
      subtotal: 408,
      total: 408,
      origen: 'demo',
    },
    {
      id: 'FF-4631',
      estado: 'ENTREGADO',
      pagado: true,
      metodoPago: 'TIENDA',
      creadoEn: new Date(now - 3 * DAY - 2 * HOUR).toISOString(),
      tiempoEstimado: '25–35 min',
      clienteCorreo: 'ana.martinez@correo.mx',
      clienteTelefono: '55 4821 7390',
      notas: '',
      items: [
        {
          productoId: 'pizza-hawaiana',
          nombre: 'Hawaiana Bianca',
          linea: 'Bianca',
          tamano: '32 cm',
          topping: 'hawaiana',
          cantidad: 2,
          precio: 209,
        },
      ],
      subtotal: 418,
      total: 418,
      origen: 'demo',
    },
  ]
}

export function getDemoOrder(id) {
  return getDemoOrders().find(
    (order) => order.id.toLowerCase() === String(id).toLowerCase(),
  )
}
