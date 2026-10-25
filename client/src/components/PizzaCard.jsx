import PizzaImage from './PizzaImage.jsx'
import { IconPlus, IconStar } from './icons.jsx'
import { formatPrice } from '../services/format.js'

export default function PizzaCard({ pizza, onAdd }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5">
      <div className="relative aspect-[4/3] bg-wash">
        <PizzaImage topping={pizza.topping} className="h-full w-full" />
        {pizza.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-ink/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            {pizza.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
          <span>{pizza.linea}</span>
          <span>{pizza.tamano}</span>
        </div>

        <div className="mt-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight text-ink">{pizza.nombre}</h3>
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-ink-soft sm:hidden">
            <IconStar className="h-3.5 w-3.5 text-star" />
            {pizza.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {pizza.descripcion}
        </p>

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted sm:hidden">
          Precio artesanal
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-extrabold text-ink">{formatPrice(pizza.precio)}</span>
          <button
            type="button"
            onClick={() => onAdd(pizza)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-95"
          >
            <IconPlus className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
