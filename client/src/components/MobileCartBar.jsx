import { formatPrice } from '../services/format.js'

export default function MobileCartBar({ count, subtotal, onOpen }) {
  if (count === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 px-4 md:hidden">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between rounded-2xl bg-ink px-5 py-3.5 text-white shadow-xl shadow-ink/20"
      >
        <span className="text-xs font-semibold uppercase tracking-wider">
          Tu selección · {count} pizza{count === 1 ? '' : 's'}
        </span>
        <span className="flex items-center gap-3">
          <span className="text-sm font-bold">{formatPrice(subtotal)}</span>
          <span className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold">Ver pedido</span>
        </span>
      </button>
    </div>
  )
}
