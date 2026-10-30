/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { STORE, STORE_HOURS } from '../data/store.js'
import { IS_MOCK } from '../services/dataSource.js'
import { getErrorMessage } from '../services/http.js'
import { getWaitTime } from '../services/orderService.js'
import {
  getClosedOverride,
  getStoreStatus,
  setClosedOverride,
} from '../services/storeService.js'

const StoreContext = createContext(null)

const INITIAL_STATUS = {
  // Fail-closed: no permitimos compras hasta que el backend confirme que
  // la tienda está abierta.
  abierta: false,
  tiempoEspera: IS_MOCK ? STORE.tiempoEspera : null,
  tiempoEstimadoMin: null,
  pedidosActivos: null,
  mensaje: '',
  horario: STORE_HOURS,
  tienda: STORE,
  origen: IS_MOCK ? 'mock' : 'api',
}

export function StoreProvider({ children }) {
  const [status, setStatus] = useState(INITIAL_STATUS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [demoClosed, setDemoClosedState] = useState(
    () => IS_MOCK && getClosedOverride() === true,
  )

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    try {
      const [storeResult, waitResult] = await Promise.allSettled([
        getStoreStatus(),
        getWaitTime(),
      ])

      if (storeResult.status === 'rejected') throw storeResult.reason

      const next = { ...storeResult.value }
      if (waitResult.status === 'fulfilled') {
        next.tiempoEstimadoMin = waitResult.value.tiempoEstimadoMin
        next.pedidosActivos = waitResult.value.pedidosActivos
        if (next.abierta && waitResult.value.tiempoEstimadoMin != null) {
          next.tiempoEspera = `~${waitResult.value.tiempoEstimadoMin} min`
        }
      }

      setStatus(next)
      setError(null)
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      setStatus((current) => ({
        ...current,
        abierta: false,
        tiempoEspera: null,
        mensaje:
          'No pudimos confirmar que la tienda esté abierta. Por seguridad, los pedidos están deshabilitados.',
        origen: IS_MOCK ? 'mock' : 'api',
      }))
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    const load = async () => {
      if (active) await refresh()
    }

    const refreshSilently = () => {
      if (active) refresh({ silent: true })
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshSilently()
    }

    load()
    const interval = window.setInterval(refreshSilently, 15000)
    window.addEventListener('focus', refreshSilently)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      active = false
      window.clearInterval(interval)
      window.removeEventListener('focus', refreshSilently)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [refresh])

  const setDemoClosed = useCallback(
    async (closed) => {
      if (!IS_MOCK) {
        throw new Error(
          'El estado de la tienda solo se cambia desde el módulo de Administración.',
        )
      }
      setClosedOverride(closed)
      setDemoClosedState(closed)
      await refresh()
    },
    [refresh],
  )

  const value = {
    ...status,
    tienda: status.tienda ?? STORE,
    horario: status.horario ?? STORE_HOURS,
    loading,
    error,
    refresh,
    demoClosed,
    setDemoClosed,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore debe usarse dentro de StoreProvider')
  }
  return context
}
