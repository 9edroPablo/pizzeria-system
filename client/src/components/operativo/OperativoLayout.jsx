import { NavLink } from 'react-router-dom'
import { IconFlame, IconUser } from '../icons.jsx'
import { formatTime } from '../../services/format.js'
import { fechaSucursal } from './utils.js'

const SUCURSAL = 'Sucursal Centro'

const NAV = [
  { to: '/mostrador', label: 'Mostrador' },
  { to: '/cocina', label: 'Cocina' },
  { to: '/admin', label: 'Admin' },
]

// Estructura común de Mostrador y Cocina según el diseño de Figma:
// barra superior, encabezado de la página, contenido y pie con la hora.
export default function OperativoLayout({ titulo, descripcion, lastUpdate, children }) {
  return (
    <div className="min-h-svh bg-[#f5f6f8] text-ink">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
              <IconFlame className="h-4 w-4" />
            </span>
            <span className="hidden text-base font-semibold tracking-wide sm:inline">
              FORNO &amp; FARINA
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
                    isActive ? 'bg-gray-100 text-ink' : 'text-ink-soft hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <span className="hidden text-sm text-ink-soft md:inline">{SUCURSAL}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-700 text-white">
              <IconUser className="h-4 w-4" />
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">
          {SUCURSAL} · {fechaSucursal()}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{titulo}</h1>
        <p className="mt-2 text-sm text-[#7a4a3a]">{descripcion}</p>

        <div className="mt-5">{children}</div>

        <footer className="mt-6 flex flex-wrap justify-between gap-2 text-xs text-ink-soft">
          <span>Última actualización: {lastUpdate ? formatTime(lastUpdate) : '—'}</span>
          <span>Los pedidos se actualizan automáticamente</span>
        </footer>
      </main>
    </div>
  )
}

export function StatCard({ valor, etiqueta }) {
  return (
    <div className="rounded-xl bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <p className="text-2xl font-bold">{valor}</p>
      <p className="mt-1 text-xs text-ink-soft">{etiqueta}</p>
    </div>
  )
}

export function Aviso({ children }) {
  return (
    <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {children}
    </p>
  )
}
