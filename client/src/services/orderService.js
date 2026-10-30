import { getDemoOrder, getDemoOrders } from '../data/demoOrders.js'
import { ORDER_STATUS } from '../context/orderStatus.js'
import { saveCustomer } from './customerService.js'
import http from './http.js'
import { IS_MOCK } from './dataSource.js'

const ORDERS_KEY = 'forno:pedidos'
const MONGO_ID = /^[a-f0-9]{24}$/i

export function isMongoOrderId(id) {
  return MONGO_ID.test(String(id ?? '').trim())
}

function readStoredOrders() {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStoredOrders(orders) {
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 30)))
  } catch {
    // Sin persistencia: el pedido se mantiene en memoria durante la sesión.
  }
}

function upsertStoredOrder(order) {
  if (!order?.id) return
  const rest = readStoredOrders().filter(
    (stored) =>
      stored.id !== order.id && (IS_MOCK || isMongoOrderId(stored.id)),
  )
  writeStoredOrders([order, ...rest])
}

// Folio visible: últimos 4 caracteres del _id de Mongo. El ID completo se
// conserva aparte porque es el que usan las rutas /api/orders/:id.
export function getFolio(order) {
  if (order?.folio) return order.folio
  const id = String(order?._id ?? order?.id ?? '').trim()
  if (!id) return '—'
  if (/^FF-/i.test(id)) return id.toUpperCase()
  return `#${id.slice(-4).toUpperCase()}`
}

function generateOrderId() {
  const used = new Set(readStoredOrders().map((order) => order.id))
  let id
  do {
    id = `FF-${Math.floor(1000 + Math.random() * 9000)}`
  } while (used.has(id))
  return id
}

function sortOrders(orders) {
  return [...orders].sort(
    (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
  )
}

function uniqueById(orders) {
  const map = new Map()
  orders.forEach((order) => {
    if (order?.id && !map.has(order.id)) map.set(order.id, order)
  })
  return [...map.values()]
}

function storedForCurrentSource() {
  const stored = readStoredOrders()
  // En modo API ignoramos pedidos mock viejos que hayan quedado guardados.
  return IS_MOCK ? stored : stored.filter((order) => isMongoOrderId(order.id))
}

export function getOrders({ includeDemo = IS_MOCK } = {}) {
  const stored = storedForCurrentSource()
  const demo = includeDemo
    ? getDemoOrders().map((order) => ({ ...order, folio: getFolio(order) }))
    : []
  return sortOrders(uniqueById([...stored, ...demo]))
}

export function getOrder(id) {
  if (!id) return null

  const raw = String(id).trim()
  const normalizedId = raw.toLowerCase()
  const normalizedFolio = (raw.startsWith('#') ? raw : `#${raw}`).toLowerCase()

  const stored = storedForCurrentSource().find((order) => {
    const orderId = String(order.id ?? '').toLowerCase()
    const orderFolio = getFolio(order).toLowerCase()
    return (
      orderId === normalizedId ||
      orderFolio === normalizedFolio ||
      orderFolio === normalizedId
    )
  })

  const demo = IS_MOCK
    ? getDemoOrder(normalizedId) ??
      getDemoOrders().find(
        (order) => order.id.toLowerCase() === normalizedId,
      )
    : null

  return stored ?? demo ?? null
}

export function getLatestOrder() {
  return getOrders()[0] ?? null
}

function buildLocalOrder(input, id) {
  const items = input.items.map((item) => ({
    productoId: item.productoId ?? item.id ?? null,
    nombre: item.nombre,
    linea: item.linea ?? '',
    tamano: item.tamano ?? '',
    topping: item.topping ?? 'pepperoni',
    imagen: item.imagen ?? '',
    cantidad: Number(item.cantidad) || 1,
    precio: Number(item.precio) || 0,
  }))
  const total = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  )
  const now = new Date().toISOString()

  return {
    id,
    folio: getFolio({ id }),
    estado: ORDER_STATUS.PENDIENTE,
    pagado: input.metodoPago === 'ANTICIPADO',
    metodoPago: input.metodoPago,
    creadoEn: now,
    actualizadoEn: now,
    tiempoEstimado: input.tiempoEstimado ?? '',
    clienteNombre: input.clienteNombre ?? '',
    clienteCorreo: String(input.clienteCorreo ?? '').trim().toLowerCase(),
    clienteTelefono: input.clienteTelefono ?? '',
    notas: input.notas ?? '',
    items,
    subtotal: total,
    total,
    origen: 'mock',
  }
}

function normalizeApiOrder(payload, fallback) {
  const base = fallback ?? {}
  const raw = payload?.pedido ?? payload?.order ?? payload?.data ?? payload ?? {}
  const previousItems = Array.isArray(base.items) ? base.items : []

  const items = Array.isArray(raw.items)
    ? raw.items.map((item, index) => {
        const previous =
          previousItems.find(
            (candidate) => candidate.nombre === item.nombre,
          ) ??
          previousItems[index] ??
          {}

        return {
          productoId:
            item.producto_id ??
            item.productoId ??
            previous.productoId ??
            null,
          nombre: item.nombre ?? previous.nombre ?? 'Pizza',
          linea: item.linea ?? previous.linea ?? '',
          tamano: item.tamano ?? previous.tamano ?? '',
          topping: item.topping ?? previous.topping ?? 'pepperoni',
          imagen: item.imagen ?? previous.imagen ?? '',
          cantidad: Number(item.cantidad) || previous.cantidad || 1,
          precio: Number(item.precio) || 0,
        }
      })
    : previousItems

  const id = String(raw._id ?? raw.id ?? base.id ?? '')
  const total = Number(raw.total ?? base.total ?? 0)
  const subtotal = Number(raw.subtotal ?? total)
  const creadoEn =
    raw.createdAt ?? raw.creadoEn ?? base.creadoEn ?? new Date().toISOString()
  const actualizadoEn = raw.updatedAt ?? raw.actualizadoEn ?? creadoEn

  return {
    ...base,
    ...raw,
    id,
    folio: raw.folio ?? getFolio({ ...raw, id }),
    estado: raw.estado ?? base.estado ?? ORDER_STATUS.PENDIENTE,
    pagado: raw.pagado ?? base.pagado ?? false,
    metodoPago: raw.metodo_pago ?? raw.metodoPago ?? base.metodoPago ?? 'TIENDA',
    creadoEn,
    actualizadoEn,
    clienteNombre:
      raw.cliente_nombre ?? raw.clienteNombre ?? base.clienteNombre ?? '',
    clienteCorreo:
      raw.cliente_correo ?? raw.clienteCorreo ?? base.clienteCorreo ?? '',
    clienteTelefono:
      raw.cliente_telefono ??
      raw.clienteTelefono ??
      base.clienteTelefono ??
      '',
    notas: raw.notas ?? base.notas ?? '',
    items,
    subtotal: Number.isFinite(subtotal) ? subtotal : total,
    total: Number.isFinite(total) ? total : 0,
    tiempoEstimado: raw.tiempoEstimado ?? base.tiempoEstimado ?? '',
    origen: 'api',
  }
}

export async function createOrder(input) {
  const localId = generateOrderId()
  const localOrder = buildLocalOrder(input, localId)

  if (!IS_MOCK) {
    const apiItems = localOrder.items.map((item) => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
      ...(isMongoOrderId(item.productoId)
        ? { producto_id: item.productoId }
        : {}),
    }))

    const { data } = await http.post('/orders', {
      cliente_correo: localOrder.clienteCorreo,
      ...(isMongoOrderId(input.usuarioId)
        ? { usuario_id: input.usuarioId }
        : {}),
      items: apiItems,
      metodo_pago: localOrder.metodoPago,
      total: localOrder.total,
    })

    const order = normalizeApiOrder(data, localOrder)
    upsertStoredOrder(order)
    saveCustomer({
      nombre: localOrder.clienteNombre,
      correo: localOrder.clienteCorreo,
      telefono: localOrder.clienteTelefono,
    })
    return order
  }

  await new Promise((resolve) => setTimeout(resolve, 650))
  upsertStoredOrder(localOrder)
  saveCustomer({
    nombre: localOrder.clienteNombre,
    correo: localOrder.clienteCorreo,
    telefono: localOrder.clienteTelefono,
  })
  return localOrder
}

// GET /api/orders/:id. El snapshot local creado por el checkout se usa como
// respaldo cuando el pedido no existe en el servidor, pero los errores de red
// o del servidor se propagan para que la pantalla pueda avisar.
export async function fetchOrderById(id) {
  if (!id) return null

  const local = getOrder(id)
  if (IS_MOCK) return local

  const apiId = isMongoOrderId(id) ? String(id).trim() : local?.id
  if (!isMongoOrderId(apiId)) return local

  try {
    const { data } = await http.get(`/orders/${apiId}`)
    const order = normalizeApiOrder(data, local ?? {})
    upsertStoredOrder(order)
    return order
  } catch (error) {
    const status = error?.response?.status
    if (status === 400 || status === 404) return local
    throw error
  }
}

// GET /api/orders/wait-time -> { pedidosActivos, tiempoEstimadoMin, tienda_abierta }
export async function getWaitTime() {
  if (IS_MOCK) {
    return { pedidosActivos: 0, tiempoEstimadoMin: 30, tiendaAbierta: null }
  }

  const { data } = await http.get('/orders/wait-time')
  const pedidosActivos = Number(data?.pedidosActivos)
  const tiempoEstimadoMin = Number(data?.tiempoEstimadoMin)

  return {
    pedidosActivos: Number.isFinite(pedidosActivos) ? pedidosActivos : null,
    tiempoEstimadoMin: Number.isFinite(tiempoEstimadoMin)
      ? tiempoEstimadoMin
      : null,
    tiendaAbierta:
      typeof data?.tienda_abierta === 'boolean' ? data.tienda_abierta : null,
  }
}

export function resetLocalOrders() {
  try {
    window.localStorage.removeItem(ORDERS_KEY)
  } catch {
    // Sin persistencia no hay nada que limpiar.
  }
}
