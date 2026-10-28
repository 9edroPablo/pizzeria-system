import { STORE, STORE_HOURS } from '../data/store.js'
import { apiFetch } from './api.js'
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
  return {
    abierta: Boolean(payload?.tienda_abierta ?? payload?.abierta ?? true),
    tiempoEspera:
      payload?.tiempo_espera ?? payload?.tiempoEspera ?? STORE.tiempoEspera,
    mensaje:
      payload?.mensaje ??
      'El estado de la tienda se actualiza directamente desde el servidor.',
    horario: STORE_HOURS,
    tienda: {
      ...STORE,
      direccion: payload?.ubicacion ?? STORE.direccion,
    },
    origen: 'api',
  }
}

export async function getStoreStatus({ signal } = {}) {
  if (IS_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 160))
    return mockStatus()
  }

  const payload = await apiFetch('/store/status', { signal })
  return normalizeApiStatus(payload)
}
