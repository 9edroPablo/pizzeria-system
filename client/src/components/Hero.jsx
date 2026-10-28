import { useStore } from '../context/StoreContext.jsx'
import { IconBag, IconClock, IconFlame } from './icons.jsx'
import PizzaImage from './PizzaImage.jsx'

export default function Hero({ total = 0 }) {
  const { abierta, loading, tiempoEspera } = useStore()

  return (
    <section className="relative overflow-hidden border-b border-line bg-cream">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/5 blur-2xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_320px] md:py-14 lg:px-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-brand">
            Tradición napolitana · 48 h de fermentación
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl">
            Nuestro <span className="text-brand">Menú</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Masa fermentada 48 horas, tomate San Marzano D.O.P. y horno de leña a
            450 °C. {total > 0 ? `${total} especialidades` : 'Especialidades'} para
            recoger al momento.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold ${
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
              {loading ? 'Consultando horario' : abierta ? 'Abierto ahora' : 'Cerrado'}
            </span>

            {abierta && !loading && (
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-bold text-ink-soft">
                <IconClock className="h-3.5 w-3.5 text-brand" />
                Listo en {tiempoEspera ?? 'unos minutos'}
              </span>
            )}

            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-bold text-ink-soft">
              <IconBag className="h-3.5 w-3.5 text-brand" />
              Solo para recoger
            </span>
          </div>
        </div>

        <div className="relative mx-auto hidden h-[300px] w-[300px] md:block">
          <div className="absolute inset-0 rounded-full border border-line bg-wash/80" />
          <div className="absolute inset-6 rounded-full border border-dashed border-brand/20" />
          <PizzaImage
            topping="margarita"
            className="absolute left-1/2 top-1/2 h-[228px] w-[228px] -translate-x-1/2 -translate-y-1/2 -rotate-6 drop-shadow-2xl"
          />
          <div className="absolute -bottom-2 left-0 flex items-center gap-2 rounded-xl border border-line bg-paper px-4 py-3 shadow-lg shadow-ink/5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <IconFlame className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Horno de leña
              </p>
              <p className="text-sm font-extrabold text-ink">450 °C</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
