/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { STORE, STORE_HOURS } from '../data/store.js'
import {
  getClosedOverride,
  getStoreStatus,
  setClosedOverride,
} from '../services/storeService.js'

const StoreContext = createContext(null)

const INITIAL_STATUS = {
  abierta: true,
  tiempoEspera: STORE.tiempoEspera,
  mensaje: '',
  horario: STORE_HOURS,
  tienda: STORE,
  origen: 'mock',
}

export function StoreProvider({ children }) {
  const [status, setStatus] = useState(INITIAL_STATUS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [demoClosed, setDemoClosedState] = useState(
    () => getClosedOverride() === true,
  )

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    try {
      const next = await getStoreStatus()
      setStatus(next)
      setError(null)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo consultar el estado de la tienda.',
      )
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    getStoreStatus()
      .then((next) => {
        if (!active) return
        setStatus(next)
        setError(null)
      })
      .catch((requestError) => {
        if (!active) return
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudo consultar el estado de la tienda.',
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const setDemoClosed = useCallback(
    async (closed) => {
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
