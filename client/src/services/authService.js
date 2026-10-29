import http from './http.js'

// POST /api/auth/register
// El registro es idempotente: si el correo ya existe, el backend devuelve
// el usuario existente en lugar de crear un duplicado. El backend solo
// necesita el correo; el nombre se conserva localmente para la interfaz.
export async function registerCustomer({ correo }) {
  const { data } = await http.post('/auth/register', {
    correo: String(correo).trim().toLowerCase(),
  })

  return data?.usuario ?? null
}
