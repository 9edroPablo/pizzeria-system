import { IconFlame } from './icons.jsx'
import StoreStatus from './StoreStatus.jsx'

export default function Hero({ abierto = true, tiempoEspera = '90s' }) {
  return (
    <section className="pb-10 pt-10 md:pt-16">
      <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Tradición Napolitana · 48H Fermentación
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink md:text-6xl">
            Nuestro Menú
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            Masa fermentada 48 horas, tomate San Marzano D.O.P. y horno de leña a 450 °C.
            Seis especialidades clásicas para comer aquí o para llevar.
          </p>
        </div>
        <span className="hidden items-center gap-2 self-end rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink md:inline-flex">
          <IconFlame className="h-4 w-4 text-brand" />
          6 Especialidades Clásicas
        </span>
      </div>
      <StoreStatus abierto={abierto} tiempoEspera={tiempoEspera} />
    </section>
  )
}
