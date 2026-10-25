import CartItem from './CartItem.jsx'
import UpsellCard from './UpsellCard.jsx'
import { IconArrowLeft, IconClose, IconLock, IconUser } from './icons.jsx'
import { formatPrice } from '../services/format.js'

export default function CheckoutScreen({ cart, onBack, onContinue }) {
  const { items, subtotal, updateQuantity, removeItem, count } = cart

  return (
    <div className="min-h-screen bg-cream pb-28">
      <header className="border-b border-line bg-cream">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition hover:bg-wash"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted">
              Cart Checkout
            </p>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink">
              Forno & Farina
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
            <IconUser className="h-4 w-4" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-ink">
            Tu carrito{' '}
            <span className="text-sm font-semibold text-muted">
              ({count} producto{count === 1 ? '' : 's'})
            </span>
          </h1>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted transition hover:text-ink"
          >
            Cerrar
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-semibold text-ink">No hay productos en tu carrito</p>
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Volver al menú
            </button>
          </div>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-paper px-5">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            <div className="mt-4">
              <UpsellCard />
            </div>

            <section className="mt-6 rounded-2xl bg-wash p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Resumen del pedido
              </h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Entrega artesanal</span>
                  <span className="font-semibold text-open">Gratis</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Impuestos</span>
                  <span className="font-semibold text-ink">IVA incluido</span>
                </div>
                <div className="flex justify-between border-t border-line pt-3">
                  <span className="font-bold text-ink">Total</span>
                  <span className="text-2xl font-extrabold text-ink">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                El tiempo estimado de espera se confirma al registrar tu pedido.
              </p>
            </section>
          </>
        )}
      </main>

      {items.length > 0 && (
        <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-paper p-4">
          <div className="mx-auto flex max-w-xl items-center gap-4">
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Total a pagar
              </p>
              <p className="text-lg font-extrabold text-ink">{formatPrice(subtotal)}</p>
            </div>
            <button
              type="button"
              onClick={onContinue}
              className="flex-1 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark active:scale-[0.98]"
            >
              Continuar al registro
            </button>
          </div>
          <p className="mx-auto mt-2 flex max-w-xl items-center justify-center gap-1.5 text-[11px] font-medium text-muted">
            <IconLock className="h-3.5 w-3.5" />
            Pago 100% seguro
          </p>
        </footer>
      )}
    </div>
  )
}
