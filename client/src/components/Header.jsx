import { IconCart, IconFlame, IconUser } from './icons.jsx'

export default function Header({ cartCount = 0, onOpenCart, abierto = true }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
            <IconFlame className="h-5 w-5" />
          </span>
          <span className="text-sm font-extrabold uppercase tracking-[0.22em] text-ink">
            Forno <span className="text-brand">&</span> Farina
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          <span className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-8">
            Pizzas
          </span>
          <a href="#" className="transition hover:text-ink">Bebidas</a>
          <a href="#" className="transition hover:text-ink">Seguimiento</a>
        </nav>

        <div className="flex items-center gap-3">
          <span
            className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
              abierto ? 'bg-open-soft text-open' : 'bg-brand-soft text-brand'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${abierto ? 'bg-open' : 'bg-brand'}`} />
            {abierto ? 'Abierto' : 'Cerrado'}
          </span>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex h-10 items-center gap-2 rounded-xl border border-line bg-paper px-4 text-sm font-semibold text-ink transition hover:border-ink/30"
          >
            <IconCart className="h-5 w-5" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
            <IconUser className="h-5 w-5" />
          </span>
        </div>
      </div>
    </header>
  )
}
