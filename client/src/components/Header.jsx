import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Logo from './Logo.jsx'
import { IconCart, IconUser } from './icons.jsx'

const LINKS = [
  { to: '/menu', label: 'Menú' },
  { to: '/seguimiento', label: 'Seguimiento' },
  { to: '/ubicacion', label: 'Ubicación' },
]

function navClass({ isActive }) {
  return `relative py-2 text-sm font-semibold transition hover:text-ink ${
    isActive
      ? 'text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand'
      : 'text-ink-soft'
  }`
}

export default function Header() {
  const { count, openCart } = useCart()
  const { abierta, loading } = useStore()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Logo compact />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider sm:inline-flex ${
              loading
                ? 'border-line bg-paper text-muted'
                : abierta
                  ? 'border-open/15 bg-open-soft text-open'
                  : 'border-brand/15 bg-brand-soft text-brand'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                loading ? 'bg-muted' : abierta ? 'bg-open' : 'bg-brand'
              }`}
            />
            {loading ? 'Consultando' : abierta ? 'Abierto ahora' : 'Cerrado'}
          </span>

          <Link
            to="/cuenta"
            aria-label="Mi cuenta"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition hover:border-ink/25 hover:text-ink"
          >
            <IconUser className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito, ${count} productos`}
            className="relative flex h-10 items-center gap-2 rounded-xl bg-ink px-3 text-sm font-semibold text-white transition hover:bg-ink-soft sm:px-4"
          >
            <IconCart className="h-5 w-5" />
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-cream bg-brand px-1 text-[10px] font-extrabold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
