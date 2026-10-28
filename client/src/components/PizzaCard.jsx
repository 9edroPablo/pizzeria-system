import PizzaImage from './PizzaImage.jsx'
import { IconPlus, IconStar } from './icons.jsx'
import { formatPrice } from '../services/format.js'

export default function PizzaCard({ pizza, onAdd, abierta = true }) {
  const agotada = pizza.disponible === false
  const deshabilitada = agotada || !abierta

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-wash">
        <PizzaImage
          topping={pizza.topping}
          src={pizza.imagen}
          alt={pizza.nombre}
          className="h-full w-full transition duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="flex flex-wrap gap-1.5">
            {pizza.badge && (
              <span className="rounded-full bg-ink/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                {pizza.badge}
              </span>
            )}
          </span>
          {pizza.vegetariana && (
            <span className="rounded-full bg-open-soft/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-open">
              Veggie
            </span>
          )}
        </div>

        {agotada && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
            <span className="rounded-full bg-paper px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-ink">
              Agotada por hoy
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
          <span>{pizza.linea}</span>
          {pizza.rating != null && (
            <span className="inline-flex items-center gap-1 text-star">
              <IconStar className="h-3 w-3" />
              <span className="text-ink-soft">{pizza.rating.toFixed(1)}</span>
            </span>
          )}
        </div>

        <h3 className="mt-2 text-lg font-extrabold tracking-tight text-ink">
          {pizza.nombre}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
          {pizza.descripcion}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xl font-extrabold text-ink">{formatPrice(pizza.precio)}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {[pizza.tamano, 'MXN'].filter(Boolean).join(' · ')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAdd(pizza)}
            disabled={deshabilitada}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-dark active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-muted"
          >
            <IconPlus className="h-4 w-4" />
            {agotada ? 'Agotada' : abierta ? 'Agregar' : 'Cerrado'}
          </button>
        </div>
      </div>
    </article>
  )
}
