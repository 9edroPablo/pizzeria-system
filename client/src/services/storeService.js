import { STORE, STORE_HOURS } from '../data/store.js'
import http from './http.js'
import { IS_MOCK } from './dataSource.js'

const CLOSED_OVERRIDE_KEY = 'forno:tienda-cerrada'

export function getClosedOverride() {
  try {
    const value = window.localStorage.getItem(CLOSED_OVERRIDE_KEY)
    if (value === '1') return true
    if (value === '0') return false
  } catch {
    // El navegador puede bloquear localStorage; seguimos con el valor abierto.
  }
  return null
}

export function setClosedOverride(closed) {
  try {
    if (closed === null) {
      window.localStorage.removeItem(CLOSED_OVERRIDE_KEY)
    } else {
      window.localStorage.setItem(CLOSED_OVERRIDE_KEY, closed ? '1' : '0')
    }
  } catch {
    // Sin persistencia: el cambio solo aplica a esta sesión.
  }
}

function mockStatus() {
  const override = getClosedOverride()
  const abierta = override === null ? true : !override

  return {
    abierta,
    tiempoEspera: abierta ? STORE.tiempoEspera : null,
    mensaje: abierta
      ? 'El horno está encendido. Tu pedido se prepara al momento.'
      : 'Volvemos a abrir en nuestro próximo horario. Puedes consultar el menú mientras tanto.',
    horario: STORE_HOURS,
    tienda: STORE,
    origen: 'mock',
  }
}

function normalizeApiStatus(payload) {
  // GET /api/store/status -> { tienda_abierta, ubicacion }.
  // Fail-closed: solo consideramos abierta cuando el backend lo confirma.
  const abierta = payload?.tienda_abierta === true

  return {
    abierta,
    tiempoEspera: null,
    mensaje: abierta
      ? 'El horno está encendido. Tu pedido se prepara al momento.'
      : 'La pizzería está cerrada en este momento. Vuelve en nuestro próximo horario.',
    horario: STORE_HOURS,
    tienda: {
      ...STORE,
      ubicacion: payload?.ubicacion ?? '',
    },
    origen: 'api',
  }
}

export async function getStoreStatus({ signal } = {}) {
  if (IS_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 160))
    return mockStatus()
  }

  const { data } = await http.get('/store/status', { signal })
  return normalizeApiStatus(data)
}
