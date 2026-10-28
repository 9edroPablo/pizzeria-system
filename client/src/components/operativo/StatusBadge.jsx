import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../context/orderStatus.js'

const STATUS_STYLES = {
  [ORDER_STATUS.PENDIENTE]: 'bg-wash text-ink-soft',
  [ORDER_STATUS.EN_PREPARACION]: 'bg-amber-100 text-amber-800',
  [ORDER_STATUS.LISTO]: 'bg-open-soft text-open',
  [ORDER_STATUS.ENTREGADO]: 'bg-ink text-white',
}

export function StatusBadge({ estado }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
        STATUS_STYLES[estado] ?? 'bg-wash text-muted'
      }`}
    >
      {ORDER_STATUS_LABELS[estado] ?? estado}
    </span>
  )
}

export function PaymentBadge({ pagado, metodoPago }) {
  if (pagado) {
    return (
      <span className="inline-flex items-center rounded-full bg-open-soft px-2.5 py-1 text-xs font-bold text-open">
        Pagado{metodoPago === 'ANTICIPADO' ? ' en línea' : ' en tienda'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand">
      Por cobrar en tienda
    </span>
  )
}
