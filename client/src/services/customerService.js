const CUSTOMER_KEY = 'forno:cliente'

// El backend solo guarda correo (y opcionalmente nombre) en el pedido.
// Conservamos los datos de contacto en este dispositivo para mostrarlos en
// la confirmación y en la cuenta sin inventar información del servidor.
export function getCustomer() {
  try {
    const raw = window.localStorage.getItem(CUSTOMER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    return {
      nombre: typeof parsed.nombre === 'string' ? parsed.nombre : '',
      correo: typeof parsed.correo === 'string' ? parsed.correo : '',
      telefono: typeof parsed.telefono === 'string' ? parsed.telefono : '',
    }
  } catch {
    return null
  }
}

export function saveCustomer(customer) {
  if (!customer?.correo) return
  try {
    window.localStorage.setItem(
      CUSTOMER_KEY,
      JSON.stringify({
        nombre: customer.nombre ?? '',
        correo: customer.correo,
        telefono: customer.telefono ?? '',
      }),
    )
  } catch {
    // Sin localStorage, el pedido sigue funcionando durante esta sesión.
  }
}

export function clearCustomer() {
  try {
    window.localStorage.removeItem(CUSTOMER_KEY)
  } catch {
    // Sin persistencia no hay nada que limpiar.
  }
}
