import PizzaImage from './PizzaImage.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import { IconTrash } from './icons.jsx'
import { formatPrice } from '../services/format.js'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <li className="flex gap-3 py-4 sm:gap-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-wash sm:h-[72px] sm:w-[72px]">
        <PizzaImage
          topping={item.topping}
          src={item.imagen}
          alt={item.nombre}
          className="h-full w-full"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-ink">{item.nombre}</p>
            <p className="mt-0.5 text-[11px] text-muted">
              {[item.linea, item.tamano].filter(Boolean).join(' · ') ||
                'Pizza artesanal'}
            </p>
          </div>
          <span className="shrink-0 text-sm font-extrabold text-ink">
            {formatPrice(item.precio * item.cantidad)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <QuantityStepper
            value={item.cantidad}
            onChange={(cantidad) => onUpdateQuantity(item.id, cantidad)}
          />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Quitar ${item.nombre}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-muted transition hover:bg-brand-soft hover:text-brand"
          >
            <IconTrash className="h-3.5 w-3.5" />
            Quitar
          </button>
        </div>
      </div>
    </li>
  )
}
