import { useStore } from '../context/StoreContext.jsx'
import { STORE } from '../data/store.js'
import PageHeader from './PageHeader.jsx'
import {
  IconArrowRight,
  IconBag,
  IconCalendar,
  IconClock,
  IconExternalLink,
  IconMail,
  IconMapPin,
  IconNavigation,
  IconPhone,
} from './icons.jsx'

function MapArtwork() {
  return (
    <div className="relative h-[360px] overflow-hidden rounded-2xl border border-line bg-wash sm:h-[440px]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(#dedad0 1px, transparent 1px), linear-gradient(90deg, #dedad0 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      <div aria-hidden="true" className="absolute left-[8%] top-0 h-full w-8 -rotate-[8deg] bg-paper" />
      <div aria-hidden="true" className="absolute left-[36%] top-0 h-full w-5 rotate-[5deg] bg-paper/90" />
      <div aria-hidden="true" className="absolute right-[12%] top-0 h-full w-10 -rotate-[4deg] bg-paper" />
      <div aria-hidden="true" className="absolute inset-x-0 top-[30%] h-6 -rotate-2 bg-paper" />
      <div aria-hidden="true" className="absolute inset-x-0 top-[63%] h-8 rotate-1 bg-paper" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[12%] h-4 -rotate-1 bg-paper/80" />

      <div
        aria-hidden="true"
        className="absolute left-[52%] top-[20%] h-24 w-20 rotate-6 rounded-lg bg-open/10"
      />
      <div
        aria-hidden="true"
        className="absolute left-[16%] top-[52%] h-20 w-24 -rotate-3 rounded-lg bg-brand/5"
      />
      <div
        aria-hidden="true"
        className="absolute right-[18%] top-[48%] h-28 w-16 rotate-2 rounded-lg bg-star/10"
      />

      <span className="absolute left-[40%] top-[45%] -rotate-[5deg] text-[9px] font-bold uppercase tracking-[0.2em] text-muted/70">
        Av. Álvaro Obregón
      </span>
      <span className="absolute right-[16%] top-[68%] rotate-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted/60">
        Córdoba
      </span>

      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -m-5 animate-ping rounded-full bg-brand/15" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-paper bg-brand text-white shadow-xl shadow-brand/30">
          <IconMapPin className="h-5 w-5" />
        </span>
        <span className="absolute left-1/2 top-[58px] w-max -translate-x-1/2 rounded-lg bg-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
          Forno & Farina
        </span>
      </div>

      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2 rounded-xl border border-line bg-paper/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div>
          <p className="text-xs font-extrabold text-ink">
            {STORE.direccion}, {STORE.colonia}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            {STORE.ciudad} {STORE.codigoPostal}
          </p>
        </div>
        <a
          href={STORE.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-ink-soft"
        >
          Abrir en Google Maps
          <IconExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}

export default function LocationScreen() {
  const { abierta, loading, tiempoEspera, horario = [] } = useStore()
  const day = new Date().getDay()
  const todayIndex = day === 0 ? 2 : day === 5 || day === 6 ? 1 : 0

  return (
    <>
      <PageHeader
        eyebrow="Visítanos"
        title="Encuéntranos en Roma Norte"
        description="Estamos a unas calles del Parque Pushkin. Ven por una pizza recién salida del horno o recoge tu pedido en el mostrador."
        actions={
          <a
            href={STORE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            <IconNavigation className="h-4 w-4" />
            Cómo llegar
          </a>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <MapArtwork />

          <aside className="space-y-5">
            <section className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                    loading
                      ? 'bg-wash text-muted'
                      : abierta
                        ? 'bg-open-soft text-open'
                        : 'bg-brand-soft text-brand'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      loading ? 'bg-muted' : abierta ? 'bg-open' : 'bg-brand'
                    }`}
                  />
                  {loading ? 'Consultando' : abierta ? 'Abierto ahora' : 'Cerrado'}
                </span>
                {abierta && !loading && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <IconClock className="h-3.5 w-3.5 text-brand" />
                    Listo en {tiempoEspera ?? STORE.tiempoEspera}
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3">
                  <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div>
                    <p className="text-xs font-bold text-ink">{STORE.direccion}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {STORE.colonia}, {STORE.ciudad} {STORE.codigoPostal}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${STORE.telefono.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-xs text-ink-soft transition hover:text-brand"
                >
                  <IconPhone className="h-4 w-4 shrink-0 text-brand" />
                  {STORE.telefonoVisible}
                </a>
                <a
                  href={`mailto:${STORE.correo}`}
                  className="flex items-center gap-3 text-xs text-ink-soft transition hover:text-brand"
                >
                  <IconMail className="h-4 w-4 shrink-0 text-brand" />
                  {STORE.correo}
                </a>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
                <IconCalendar className="h-4 w-4 text-brand" />
                <h2 className="text-sm font-extrabold text-ink">Horarios</h2>
              </div>
              <ul className="divide-y divide-line">
                {horario.map((item, index) => (
                  <li
                    key={item.dia}
                    className={`flex items-center justify-between px-5 py-3 text-xs ${
                      index === todayIndex ? 'bg-brand-soft/40' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold text-ink-soft">
                      {item.dia}
                      {index === todayIndex && (
                        <span className="rounded-full bg-brand px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                          Hoy
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-ink">{item.horas}</span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-line px-5 py-3 text-[10px] leading-relaxed text-muted">
                Último pedido 30 minutos antes del cierre. El estado de la tienda se
                actualizará desde el servidor.
              </p>
            </section>

            <a
              href={STORE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-2xl bg-ink p-5 text-white transition hover:bg-ink-soft"
            >
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                  Google Maps
                </span>
                <span className="mt-1 block text-sm font-extrabold">
                  Abrir ruta paso a paso
                </span>
              </span>
              <IconArrowRight className="h-5 w-5" />
            </a>
          </aside>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              Icon: IconNavigation,
              title: 'En metro',
              text: 'Metro Insurgentes (Línea 1), a 6 minutos caminando.',
            },
            {
              Icon: IconBag,
              title: 'En auto',
              text: 'Estacionamiento público sobre Córdoba 42, a media cuadra.',
            },
            {
              Icon: IconCalendar,
              title: 'Eventos privados',
              text: 'Escríbenos para reservar el salón en grupos de 10 a 30 personas.',
            },
          ].map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-line bg-paper p-5 transition hover:border-ink/15"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 text-sm font-extrabold text-ink">{title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
