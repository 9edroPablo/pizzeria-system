const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

// Wrapper de fetch para todos los servicios del cliente.
export async function apiFetch(path, { signal, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    signal,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    let mensaje = `Error ${response.status}: no se pudo consultar ${path}`
    try {
      const errData = await response.json()
      if (errData?.mensaje) mensaje = errData.mensaje
    } catch {
      // Ignorar si no es JSON
    }
    throw new Error(mensaje)
  }

  return response.json()
}
