import { Link } from 'react-router-dom'
import { STORE } from '../data/store.js'
import Logo from './Logo.jsx'
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMapPin,
  IconPhone,
} from './icons.jsx'

const NAV = [
  { to: '/menu', label: 'Menú' },
  { to: '/seguimiento', label: 'Seguimiento' },
  { to: '/ubicacion', label: 'Ubicación' },
  { to: '/cuenta', label: 'Mi cuenta' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-wash/60 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr] lg:px-10">
        <div>
          <Logo subtitle="Pizzería Napolitana Auténtica" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Masa fermentada 48 horas, tomate San Marzano y horno de leña. Hecha al
            momento, como en Nápoles.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              href={STORE.redes.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de Forno & Farina"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper text-ink-soft transition hover:text-brand"
            >
              <IconInstagram className="h-4 w-4" />
            </a>
            <a
              href={STORE.redes.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook de Forno & Farina"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper text-ink-soft transition hover:text-brand"
            >
              <IconFacebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
            Explorar
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold text-ink-soft">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
            Visítanos
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="flex gap-2.5">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>
                {STORE.direccion}, {STORE.colonia}
                <br />
                {STORE.ciudad} {STORE.codigoPostal}
              </span>
            </li>
            <li className="flex gap-2.5">
              <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>Lun – Dom · desde las 13:00</span>
            </li>
            <li className="flex gap-2.5">
              <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <a href={`tel:${STORE.telefono}`} className="hover:text-brand">
                {STORE.telefono}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>© 2026 Forno & Farina. Todos los derechos reservados.</p>
          <p>Precios en MXN · IVA incluido</p>
        </div>
      </div>
    </footer>
  )
}
