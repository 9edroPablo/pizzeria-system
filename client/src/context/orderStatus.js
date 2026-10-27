// Estados oficiales de pedido en TODO el sistema.
// No cambiar los valores: backend, mostrador, cocina y cliente los usan tal cual.
export const ORDER_STATUS = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  EN_PREPARACION: 'EN_PREPARACION',
  LISTO: 'LISTO',
  ENTREGADO: 'ENTREGADO',
})

export const ORDER_STATUS_LABELS = Object.freeze({
  [ORDER_STATUS.PENDIENTE]: 'Pendiente',
  [ORDER_STATUS.EN_PREPARACION]: 'En preparación',
  [ORDER_STATUS.LISTO]: 'Listo',
  [ORDER_STATUS.ENTREGADO]: 'Entregado',
})

export const ORDER_STATUS_DESCRIPTIONS = Object.freeze({
  [ORDER_STATUS.PENDIENTE]: 'Recibimos tu pedido y ya está en la fila del horno.',
  [ORDER_STATUS.EN_PREPARACION]: 'Estamos estirando la masa y horneando tu pizza.',
  [ORDER_STATUS.LISTO]: 'Tu pedido está listo para recoger en el mostrador.',
  [ORDER_STATUS.ENTREGADO]: '¡Buen provecho! Este pedido ya fue entregado.',
})

export const ORDER_FLOW = Object.freeze([
  ORDER_STATUS.PENDIENTE,
  ORDER_STATUS.EN_PREPARACION,
  ORDER_STATUS.LISTO,
  ORDER_STATUS.ENTREGADO,
])

export function getStatusIndex(estado) {
  const index = ORDER_FLOW.indexOf(estado)
  return index === -1 ? 0 : index
}
