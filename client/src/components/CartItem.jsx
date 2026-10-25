import PizzaImage from './PizzaImage.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import { IconTrash } from './icons.jsx'
import { formatPrice } from '../services/format.js'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <li className="flex gap-4 py-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-wash">
        <PizzaImage topping={item.topping} className="h-full w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold leading-tight text-ink">{item.nombre}</p>
            <p className="mt-0.5 text-xs text-muted">
              {item.linea} · {item.tamano}
            </p>
          </div>
          <span className="shrink-0 text-sm font-bold text-ink">
            {formatPrice(item.precio * item.cantidad)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <QuantityStepper
            value={item.cantidad}
            onChange={(cantidad) => onUpdateQuantity(item.id, cantidad)}
          />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-brand"
          >
            <IconTrash className="h-4 w-4" />
            Quitar
          </button>
        </div>
      </div>
    </li>
  )
}
