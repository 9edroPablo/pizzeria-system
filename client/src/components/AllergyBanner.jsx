import { Link } from 'react-router-dom'
import { IconLeaf, IconPhone } from './icons.jsx'

export default function AllergyBanner() {
  return (
    <section className="mt-12 flex flex-col gap-5 rounded-2xl border border-line bg-wash p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-open">
          <IconLeaf className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-extrabold text-ink">Alérgenos e ingredientes</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            Nuestras pizzas contienen gluten y lácteos. Si tienes alguna alergia o
            restricción, escríbenos al hacer tu pedido y el equipo te ayuda a elegir.
          </p>
        </div>
      </div>
      <Link
        to="/ubicacion"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 py-2.5 text-xs font-bold text-ink transition hover:border-ink/25"
      >
        <IconPhone className="h-4 w-4 text-brand" />
        Contactar a la pizzería
      </Link>
    </section>
  )
}
