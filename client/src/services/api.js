const API_URL = import.meta.env.VITE_API_URL ?? '/api'

// Wrapper de fetch para todos los servicios del cliente.
export async function apiFetch(path, { signal, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    signal,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: no se pudo consultar ${path}`)
  }

  return response.json()
}
