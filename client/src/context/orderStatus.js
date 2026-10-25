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

export const ORDER_FLOW = Object.freeze([
  ORDER_STATUS.PENDIENTE,
  ORDER_STATUS.EN_PREPARACION,
  ORDER_STATUS.LISTO,
  ORDER_STATUS.ENTREGADO,
])
