export default function StoreStatus({ abierto = true, tiempoEspera = '90s' }) {
  return (
    <div className="mt-6 flex items-center gap-3 md:hidden">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
          abierto ? 'bg-open-soft text-open' : 'bg-brand-soft text-brand'
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${abierto ? 'bg-open' : 'bg-brand'}`} />
        {abierto ? 'Abierto' : 'Cerrado'}
      </span>
      {abierto && (
        <span className="text-xs font-semibold text-open">
          Tiempo de espera · Listo en {tiempoEspera}
        </span>
      )}
    </div>
  )
}
