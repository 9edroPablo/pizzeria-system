import CartItem from './CartItem.jsx'
import UpsellCard from './UpsellCard.jsx'
import { IconCart, IconClose, IconLock } from './icons.jsx'
import { formatPrice } from '../services/format.js'

export default function CartDrawer({
  open,
  items,
  subtotal,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-ink">Tu carrito</h2>
            <p className="text-xs text-muted">
              {items.length} producto{items.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-wash"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-wash text-muted">
                <IconCart className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold text-ink">Tu carrito está vacío</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Ver el menú
              </button>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                  />
                ))}
              </ul>
              <div className="py-4">
                <UpsellCard />
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-line bg-paper px-6 py-5">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Total</span>
              <span className="text-2xl font-extrabold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="mt-4 w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark active:scale-[0.98]"
            >
              Proceder al pago
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted">
              <IconLock className="h-3.5 w-3.5" />
              Pago 100% seguro · Datos encriptados
            </p>
          </footer>
        )}
      </aside>
    </div>
  )
}
