export function paymentLabel(metodoPago) {
  return metodoPago === 'ANTICIPADO'
    ? 'Pago anticipado (simulado)'
    : 'Pago al recoger'
}

export const PAYMENT_LABELS = Object.freeze({
  ANTICIPADO: 'Pago anticipado (simulado)',
  TIENDA: 'Pago al recoger',
})
