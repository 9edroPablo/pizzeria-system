import { PIZZAS } from './mockData.js'
// import { apiFetch } from './api.js'

// Mientras Marco termina GET /api/menu usamos los datos de ejemplo.
// Cuando su endpoint esté listo, esta función cambia a:
//   return apiFetch('/menu')
// y si los nombres de campos difieren, se traducen aquí para que
// las pantallas no tengan que cambiar.
export async function getMenu() {
  return PIZZAS
}
