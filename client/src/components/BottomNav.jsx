import { NavLink } from 'react-router-dom'
import { IconHome, IconMapPin, IconReceipt, IconUser } from './icons.jsx'

const ITEMS = [
  { to: '/menu', label: 'Menú', Icon: IconHome },
  { to: '/seguimiento', label: 'Pedidos', Icon: IconReceipt },
  { to: '/ubicacion', label: 'Ubicación', Icon: IconMapPin },
  { to: '/cuenta', label: 'Cuenta', Icon: IconUser },
]

export default function BottomNav() {
  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden print:hidden"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition ${
                  isActive ? 'text-brand' : 'text-muted hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
                      isActive ? 'bg-brand-soft' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
