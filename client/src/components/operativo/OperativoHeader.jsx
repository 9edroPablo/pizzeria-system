import { Link } from 'react-router-dom'
import Logo from '../Logo.jsx'
import { IconRefresh } from '../icons.jsx'
import { formatTime } from '../../services/format.js'

// Barra superior compartida por Mostrador y Cocina.
export default function OperativoHeader({
  titulo,
  subtitulo,
  lastUpdate,
  onRefresh,
  otraPantalla,
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Logo compact subtitle="Operación" />
          <div className="border-l border-line pl-4">
            <h1 className="text-lg font-extrabold leading-tight text-ink">{titulo}</h1>
            <p className="text-xs text-muted">{subtitulo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted sm:inline">
            {lastUpdate ? `Actualizado ${formatTime(lastUpdate)}` : 'Cargando…'}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-ink/30"
          >
            <IconRefresh className="h-4 w-4" />
            Actualizar
          </button>
          {otraPantalla && (
            <Link
              to={otraPantalla.to}
              className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft"
            >
              {otraPantalla.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
