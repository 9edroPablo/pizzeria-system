import http from './http.js'

// POST /api/auth/register
// El registro es idempotente: si el correo ya existe, el backend devuelve
// el usuario existente en lugar de crear un duplicado.
export async function registerCustomer({ nombre, correo }) {
  const { data } = await http.post('/auth/register', {
    correo: String(correo).trim().toLowerCase(),
    ...(nombre && String(nombre).trim()
      ? { nombre: String(nombre).trim() }
      : {}),
  })

  return data?.usuario ?? null
}
