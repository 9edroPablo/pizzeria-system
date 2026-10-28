// Folio corto para leerlo en voz alta: últimos 4 caracteres del _id de Mongo.
// Si el backend agrega un número de pedido (ej. 1043), se usa ese.
export function folio(order) {
  if (order?.numero) return `#${order.numero}`
  const id = String(order?._id ?? order?.id ?? '')
  return `#${id.slice(-4).toUpperCase()}`
}

// Minutos transcurridos desde que se creó el pedido.
export function minutosDesde(fecha) {
  const ms = Date.now() - new Date(fecha).getTime()
  return Number.isNaN(ms) ? 0 : Math.max(0, Math.floor(ms / 60000))
}

// Dinero con dos decimales, como en el diseño: $30.00
const money = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
export function formatMoney(value) {
  return money.format(Number(value) || 0)
}

// "MARTES 27 OCT 2026"
export function fechaSucursal(date = new Date()) {
  const partes = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date)
  const get = (tipo) => partes.find((p) => p.type === tipo)?.value ?? ''
  return `${get('weekday')} ${get('day')} ${get('month').replace('.', '')} ${get('year')}`.toUpperCase()
}

// Nombre a mostrar del cliente: el backend solo guarda el correo por ahora.
export function nombreCliente(order) {
  return order?.cliente_nombre || order?.cliente_correo || 'Cliente'
}
