import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { formatPrice } from '../services/format.js'
import { IconCart, IconChevronRight } from './icons.jsx'

export default function MobileCartBar() {
  const { count, subtotal, openCart } = useCart()
  const { abierta } = useStore()

  if (count === 0 || !abierta) return null

  return (
    <div className="fixed inset-x-0 bottom-[72px] z-30 px-4 md:hidden">
      <button
        type="button"
        onClick={openCart}
        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-left text-white shadow-xl shadow-ink/25 active:scale-[0.99]"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <IconCart className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">
              Tu pedido · {count} {count === 1 ? 'pizza' : 'pizzas'}
            </span>
            <span className="block text-sm font-extrabold">
              {formatPrice(subtotal)}
            </span>
          </span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-xl bg-brand px-3 py-2 text-xs font-bold">
          Ver carrito
          <IconChevronRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </div>
  )
}
