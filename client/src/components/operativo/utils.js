// Folio corto para leerlo en voz alta: últimos 4 caracteres del _id de Mongo.
export function folio(order) {
  const id = String(order?._id ?? order?.id ?? '')
  return `#${id.slice(-4).toUpperCase()}`
}

// Minutos transcurridos desde que se creó el pedido.
export function minutosDesde(fecha) {
  const ms = Date.now() - new Date(fecha).getTime()
  return Number.isNaN(ms) ? 0 : Math.max(0, Math.floor(ms / 60000))
}
