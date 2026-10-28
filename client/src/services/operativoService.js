import http from './http.js'

// Rutas del backend (Diego e Isaías) para Mostrador y Cocina.

// GET /api/orders/active -> pedidos que no están ENTREGADO
export async function getActiveOrders() {
  const { data } = await http.get('/orders/active')
  return Array.isArray(data) ? data : []
}

// GET /api/kitchen/orders -> PENDIENTE y EN_PREPARACION,
// ya ordenados: primero los pagados, luego los más antiguos
export async function getKitchenOrders() {
  const { data } = await http.get('/kitchen/orders')
  return Array.isArray(data) ? data : []
}

// PATCH /api/orders/:id/pay -> marca el pedido como pagado
export async function markOrderAsPaid(id) {
  const { data } = await http.patch(`/orders/${id}/pay`)
  return data.pedido
}

// GET /api/store/status -> { tienda_abierta, ubicacion }
export async function getStoreStatus() {
  const { data } = await http.get('/store/status')
  return data
}

// PATCH /api/store/status  body: { tienda_abierta } y/o { ubicacion }
export async function updateStoreStatus(cambios) {
  const { data } = await http.patch('/store/status', cambios)
  return data
}

// GET /api/orders/history -> { totalVentas, cantidad, pedidos } (solo ENTREGADO)
export async function getSalesHistory() {
  const { data } = await http.get('/orders/history')
  return {
    totalVentas: Number(data?.totalVentas) || 0,
    cantidad: Number(data?.cantidad) || 0,
    pedidos: Array.isArray(data?.pedidos) ? data.pedidos : [],
  }
}

// PATCH /api/orders/:id/status  body: { estado }
export async function updateOrderStatus(id, estado) {
  const { data } = await http.patch(`/orders/${id}/status`, { estado })
  return data.pedido
}
