import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../services/http.js'

// Carga datos del backend y los vuelve a pedir cada `intervalMs`.
// Sirve para que Mostrador, Cocina y Admin vean los cambios sin recargar.
// `initialData` es el valor mientras carga ([] para listas, null para objetos).
export function usePolling(fetcher, intervalMs = 10000, initialData = []) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  const refresh = useCallback(async () => {
    try {
      const result = await fetcherRef.current()
      setData(result)
      setError('')
      setLastUpdate(new Date())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Primera carga inmediata y luego cada intervalMs.
    const first = setTimeout(refresh, 0)
    const id = setInterval(refresh, intervalMs)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [refresh, intervalMs])

  return { data, setData, loading, error, lastUpdate, refresh }
}
