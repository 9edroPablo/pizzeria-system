import { useStore } from '../context/StoreContext.jsx'

export default function StoreStatus({ compact = false }) {
  const { abierta, loading, tiempoEspera } = useStore()

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
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
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
          abierta ? 'bg-open-soft text-open' : 'bg-brand-soft text-brand'
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${abierta ? 'bg-open' : 'bg-brand'}`} />
        {abierta ? 'Abierto ahora' : 'Cerrado'}
      </span>
      {abierta && tiempoEspera && (
        <span className="text-xs font-semibold text-muted">
          Listo en {tiempoEspera}
        </span>
      )}
    </div>
  )
}
