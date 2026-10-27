export function paymentLabel(metodoPago) {
  return metodoPago === 'ANTICIPADO' ? 'Pagado en línea' : 'Pago al recoger'
}

export const PAYMENT_LABELS = Object.freeze({
  ANTICIPADO: 'Pagado en línea',
  TIENDA: 'Pago al recoger',
})
