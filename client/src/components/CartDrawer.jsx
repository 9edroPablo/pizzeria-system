import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { formatPrice } from '../services/format.js'
import CartItem from './CartItem.jsx'
import {
  IconAlert,
  IconArrowRight,
  IconBag,
  IconCart,
  IconClose,
  IconShieldCheck,
} from './icons.jsx'

export default function CartDrawer() {
  const { open, closeCart, items, count, subtotal, updateQuantity, removeItem } =
    useCart()
  const { abierta, tiempoEspera } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCart()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, closeCart])

  if (!open) return null

  const goToCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-50 print:hidden" role="dialog" aria-modal="true" aria-label="Carrito">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <IconCart className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-ink">Tu carrito</h2>
              <p className="text-xs text-muted">
                {count} {count === 1 ? 'pizza' : 'pizzas'} · {formatPrice(subtotal)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-wash"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6">
          {!abierta && items.length > 0 && (
            <div className="mt-4 flex gap-3 rounded-xl border border-brand/15 bg-brand-soft p-4 text-brand">
              <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs font-semibold leading-relaxed">
                La tienda está cerrada. Guardamos tu carrito para que puedas pedir
                en el próximo horario.
              </p>
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wash text-muted">
                <IconCart className="h-7 w-7" />
              </span>
              <div>
                <p className="text-base font-extrabold text-ink">
                  Tu carrito está vacío
                </p>
                <p className="mt-1 max-w-[240px] text-sm text-muted">
                  Elige una pizza del menú para empezar tu pedido.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
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
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </ul>

              <div className="my-5 flex items-start gap-3 rounded-xl bg-wash p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-paper text-brand">
                  <IconBag className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">Recoger en la pizzería</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    Av. Álvaro Obregón 168, Roma Norte. Listo en{' '}
                    {tiempoEspera ?? '25–35 min'}.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-line bg-paper px-5 py-5 sm:px-6">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-ink-soft">
                <span>Recoger en tienda</span>
                <span className="font-semibold text-open">Gratis</span>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3">
                <span className="font-bold text-ink">Total</span>
                <span className="text-2xl font-extrabold text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={goToCheckout}
              disabled={!abierta}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted"
            >
              {abierta ? 'Continuar al checkout' : 'Tienda cerrada'}
              {abierta && <IconArrowRight className="h-4 w-4" />}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted">
              <IconShieldCheck className="h-3.5 w-3.5" />
              Pago simulado y datos protegidos en esta demostración
            </p>
          </footer>
        )}
      </aside>
    </div>
  )
}
