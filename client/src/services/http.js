import axios from 'axios'

// Instancia de Axios para las pantallas operativas (Mostrador y Cocina).
// Usa la misma variable que el resto del cliente; si no existe, apunta
// directo al servidor local.
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// El backend responde los errores como { mensaje, error }.
// Esta función devuelve un texto listo para mostrar en pantalla.
export function getErrorMessage(error) {
  if (error?.response?.data?.mensaje) return error.response.data.mensaje
  if (error?.code === 'ECONNABORTED') return 'El servidor tardó demasiado en responder.'
  if (error?.request && !error?.response) {
    return 'No hay conexión con el servidor. ¿Está corriendo en el puerto 5000?'
  }
  return error?.message ?? 'Ocurrió un error inesperado.'
}

export default http
