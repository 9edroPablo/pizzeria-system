import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../services/http.js'

// Carga una lista del backend y la vuelve a pedir cada `intervalMs`.
// Sirve para que Mostrador y Cocina vean los pedidos nuevos sin recargar.
export function usePolling(fetcher, intervalMs = 10000) {
  const [data, setData] = useState([])
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

  return { data, loading, error, lastUpdate, refresh }
}
