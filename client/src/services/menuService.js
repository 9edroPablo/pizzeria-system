import { PIZZAS } from '../data/pizzas.js'
import http from './http.js'
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
  const text = `${raw.nombre ?? ''} ${raw.descripcion ?? ''}`.toLowerCase()
  if (text.includes('margarita') || text.includes('margherita')) return 'margarita'
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
  const rating = Number(raw.rating ?? raw.calificacion)
  const text = `${raw.nombre ?? ''} ${raw.descripcion ?? ''}`.toLowerCase()
  const esVegetariana =
    raw.vegetariana ??
    raw.vegetarian ??
    (text.includes('vegetariana') || text.includes('veggie'))

  return {
    id: String(id),
    nombre: raw.nombre ?? raw.name ?? 'Pizza de la casa',
    linea: raw.linea ?? 'Pizza artesanal',
    descripcion: raw.descripcion ?? raw.description ?? '',
    precio: Number.isFinite(precio) ? precio : 0,
    tamano: raw.tamano ?? raw.size ?? '',
    badge: raw.badge ?? null,
    rating: Number.isFinite(rating) && rating > 0 ? rating : null,
    topping: inferTopping(raw, index),
    disponible: raw.disponible !== false && raw.available !== false,
    ingredientes: Array.isArray(raw.ingredientes)
      ? raw.ingredientes
      : Array.isArray(raw.ingredients)
        ? raw.ingredients
        : [],
    vegetariana: Boolean(esVegetariana),
    imagen: raw.imagen ?? raw.imagen_url ?? raw.image ?? '',
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

  // GET /api/menu devuelve PIZZA, BEBIDA y COMPLEMENTO. El flujo del cliente
  // solo vende pizzas, así que filtramos antes de normalizar.
  const { data } = await http.get('/menu', { signal })
  return pickList(data)
    .filter(
      (raw) => String(raw?.categoria ?? raw?.category ?? '').toUpperCase() === 'PIZZA',
    )
    .map(normalizePizza)
}
