import { IconFlame } from './icons.jsx'

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <IconFlame className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-ink">
              Forno & Farina
            </p>
            <p className="text-xs text-muted">Pizzería Napolitana Auténtica</p>
          </div>
        </div>
        <p className="text-xs text-muted">
          © 2026 Forno & Farina. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
