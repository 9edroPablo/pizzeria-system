import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../context/orderStatus.js'

const STATUS_STYLES = {
  [ORDER_STATUS.PENDIENTE]: 'bg-gray-100 text-gray-700',
  [ORDER_STATUS.EN_PREPARACION]: 'bg-[#fbeee4] text-[#7a3e1d]',
  [ORDER_STATUS.LISTO]: 'bg-green-50 text-green-800',
  [ORDER_STATUS.ENTREGADO]: 'bg-gray-800 text-white',
}

const BASE = 'inline-flex items-center rounded px-2 py-1 text-[11px] font-medium'

// Etiqueta legible: "En preparación"
export function StatusBadge({ estado }) {
  return (
    <span className={`${BASE} ${STATUS_STYLES[estado] ?? 'bg-gray-100 text-gray-600'}`}>
      {ORDER_STATUS_LABELS[estado] ?? estado}
    </span>
  )
}

// Etiqueta con el valor oficial: "EN_PREPARACION" (la usa Cocina)
export function StatusCode({ estado }) {
  return (
    <span
      className={`${BASE} font-semibold tracking-wide ${
        STATUS_STYLES[estado] ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      {estado}
    </span>
  )
}

export function PriorityBadge({ alta }) {
  return (
    <span
      className={`${BASE} ${alta ? 'bg-[#fbeee4] text-[#7a3e1d]' : 'bg-gray-100 text-gray-700'}`}
    >
      {alta ? 'Prioridad alta' : 'Prioridad normal'}
    </span>
  )
}
