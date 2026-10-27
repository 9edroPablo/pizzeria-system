import { getDemoOrder, getDemoOrders } from '../data/demoOrders.js'
import { ORDER_FLOW, ORDER_STATUS, getStatusIndex } from '../context/orderStatus.js'
import { apiFetch } from './api.js'
import { IS_MOCK } from './dataSource.js'

const ORDERS_KEY = 'forno:pedidos'
const SIMULATION_STEP_MS = 40 * 1000

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

function generateOrderId() {
  const used = new Set(readStoredOrders().map((order) => order.id))
  let id
  do {
    id = `FF-${Math.floor(1000 + Math.random() * 9000)}`
  } while (used.has(id))
  return id
}

function applySimulation(order) {
  if (!IS_MOCK || !order.simulado || order.estadoManual) return order

  const created = new Date(order.creadoEn).getTime()
  if (Number.isNaN(created)) return order

  const elapsed = Math.max(0, Date.now() - created)
  const step = Math.min(
    ORDER_FLOW.length - 1,
    Math.floor(elapsed / SIMULATION_STEP_MS),
  )

  return { ...order, estado: ORDER_FLOW[step] }
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

export function getOrders({ includeDemo = IS_MOCK } = {}) {
  const stored = readStoredOrders()
  const orders = includeDemo ? [...stored, ...getDemoOrders()] : stored
  return sortOrders(uniqueById(orders)).map(applySimulation)
}

export function getOrder(id) {
  if (!id) return null
  const normalizedId = String(id).trim().toLowerCase()
  const stored = readStoredOrders().find(
    (order) => order.id.toLowerCase() === normalizedId,
  )
  const demo = IS_MOCK
    ? getDemoOrder(normalizedId) ??
      getDemoOrders().find((order) => order.id.toLowerCase() === normalizedId)
    : null
  const order = stored ?? demo ?? null

  return order ? applySimulation(order) : null
}

export function getLatestOrder() {
  return getOrders()[0] ?? null
}

function buildLocalOrder(input, id) {
  const items = input.items.map((item) => ({
    productoId: item.productoId ?? null,
    nombre: item.nombre,
    linea: item.linea ?? '',
    tamano: item.tamano ?? '',
    topping: item.topping ?? 'pepperoni',
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
    estado: ORDER_STATUS.PENDIENTE,
    pagado: input.metodoPago === 'ANTICIPADO',
    metodoPago: input.metodoPago,
    creadoEn: now,
    actualizadoEn: now,
    tiempoEstimado: input.tiempoEstimado ?? '25–35 min',
    clienteNombre: input.clienteNombre ?? '',
    clienteCorreo: input.clienteCorreo,
    clienteTelefono: input.clienteTelefono ?? '',
    notas: input.notas ?? '',
    items,
    subtotal: total,
    total,
    simulado: true,
    origen: 'mock',
  }
}

function normalizeApiOrder(payload, fallback) {
  const raw = payload?.pedido ?? payload?.order ?? payload?.data ?? payload
  const id = raw?.codigo ?? raw?._id ?? raw?.id ?? fallback.id
  const estado = raw?.estado ?? fallback.estado
  const items = Array.isArray(raw?.items)
    ? raw.items.map((item) => ({
        productoId: item.producto_id ?? item.productoId ?? null,
        nombre: item.nombre ?? 'Pizza',
        linea: item.linea ?? '',
        tamano: item.tamano ?? '',
        topping: item.topping ?? 'pepperoni',
        cantidad: Number(item.cantidad) || 1,
        precio: Number(item.precio) || 0,
      }))
    : fallback.items

  return {
    ...fallback,
    ...raw,
    id: String(id),
    estado,
    items,
    total: Number(raw?.total ?? fallback.total),
    subtotal: Number(raw?.subtotal ?? fallback.subtotal),
    simulado: false,
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
      ...(item.productoId && /^[a-f0-9]{24}$/i.test(item.productoId)
        ? { producto_id: item.productoId }
        : {}),
    }))

    const payload = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({
        cliente_correo: localOrder.clienteCorreo,
        items: apiItems,
        metodo_pago: localOrder.metodoPago,
        total: localOrder.total,
      }),
    })

    const order = normalizeApiOrder(payload, localOrder)
    writeStoredOrders([order, ...readStoredOrders()])
    return order
  }

  await new Promise((resolve) => setTimeout(resolve, 650))
  writeStoredOrders([localOrder, ...readStoredOrders()])
  return localOrder
}

export function advanceOrderStatus(id) {
  const stored = readStoredOrders()
  const index = stored.findIndex(
    (order) => order.id.toLowerCase() === String(id).toLowerCase(),
  )
  if (index === -1) return null

  const current = applySimulation(stored[index])
  const nextStatus =
    ORDER_FLOW[Math.min(getStatusIndex(current.estado) + 1, ORDER_FLOW.length - 1)]
  const updated = {
    ...stored[index],
    estado: nextStatus,
    estadoManual: true,
    actualizadoEn: new Date().toISOString(),
  }
  stored[index] = updated
  writeStoredOrders(stored)
  return updated
}

export function resetLocalOrders() {
  try {
    window.localStorage.removeItem(ORDERS_KEY)
  } catch {
    // Sin persistencia no hay nada que limpiar.
  }
}
