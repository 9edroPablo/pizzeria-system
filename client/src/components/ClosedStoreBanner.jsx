import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { IconAlert, IconArrowRight, IconClock } from './icons.jsx'

export default function ClosedStoreBanner() {
  const { abierta, mensaje, loading, horario = [] } = useStore()

  if (loading || abierta) return null

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/20 bg-brand-soft">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <IconAlert className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              Tienda cerrada
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-ink">
              El horno está descansando
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
              {mensaje ||
                'Vuelve en nuestro próximo horario. Puedes consultar el menú mientras tanto.'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <IconClock className="h-3.5 w-3.5 text-brand" />
                {horario.find((item) => item.abierto)?.dia ?? 'Lun – Dom'} ·{' '}
                {horario.find((item) => item.abierto)?.horas ?? '13:00 – 22:00'}
              </span>
            </div>
          </div>
        </div>
        <Link
          to="/ubicacion"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-ink-soft"
        >
          Ver horarios
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
