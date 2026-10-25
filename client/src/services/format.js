// Formatea un número como precio en dólares, igual que en el diseño del Figma.
export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`
}
