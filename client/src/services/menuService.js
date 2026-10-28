import { PIZZAS } from '../data/pizzas.js'
import { apiFetch } from './api.js'
import { IS_MOCK } from './dataSource.js'

function pickList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.pizzas)) return payload.pizzas
  if (Array.isArray(payload?.menu)) return payload.menu
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function inferTopping(raw, index) {
  if (raw.topping) return raw.topping
  const text = `${raw.nombre ?? ''} ${raw.categoria ?? ''}`.toLowerCase()
  if (text.includes('margarita')) return 'margarita'
  if (text.includes('pepperoni')) return 'pepperoni'
  if (text.includes('hawaiana')) return 'hawaiana'
  if (text.includes('queso')) return 'quesos'
  if (text.includes('vegetariana') || text.includes('veggie')) return 'vegetariana'
  if (text.includes('mexicana') || text.includes('picante')) return 'mexicana'
  return ['pepperoni', 'margarita', 'quesos', 'vegetariana', 'hawaiana', 'mexicana'][
    index % 6
  ]
}

function normalizePizza(raw, index) {
  const id = raw.id ?? raw._id ?? raw.slug ?? `pizza-${index + 1}`
  const precio = Number(raw.precio ?? raw.price ?? 0)

  return {
    id: String(id),
    nombre: raw.nombre ?? raw.name ?? 'Pizza de la casa',
    linea: raw.linea ?? raw.categoria ?? raw.category ?? 'Especialidades',
    descripcion: raw.descripcion ?? raw.description ?? '',
    precio: Number.isFinite(precio) ? precio : 0,
    tamano: raw.tamano ?? raw.size ?? '32 cm',
    badge: raw.badge ?? null,
    rating: Number(raw.rating ?? raw.calificacion ?? 4.8),
    topping: inferTopping(raw, index),
    disponible: raw.disponible !== false && raw.available !== false,
    ingredientes: Array.isArray(raw.ingredientes)
      ? raw.ingredientes
      : Array.isArray(raw.ingredients)
        ? raw.ingredients
        : [],
    vegetariana: Boolean(raw.vegetariana ?? raw.vegetarian),
  }
}

export async function getMenu({ signal } = {}) {
  if (IS_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 280))
    return PIZZAS.map((pizza) => ({
      ...pizza,
      ingredientes: [...pizza.ingredientes],
    }))
  }

  const payload = await apiFetch('/menu', { signal })
  return pickList(payload).map(normalizePizza)
}
