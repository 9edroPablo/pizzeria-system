import { TIENDA } from './mockData.js'
// import { apiFetch } from './api.js'

// Mientras Isaías termina su endpoint de estado usamos los datos de ejemplo.
// Cuando esté listo, esta función cambia a:
//   return apiFetch('/estado-tienda')
export async function getStoreStatus() {
  return TIENDA
}
