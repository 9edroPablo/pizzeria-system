import PizzaImage from './PizzaImage.jsx'
import { formatPrice } from '../services/format.js'
import { paymentLabel } from '../services/orderLabels.js'
import {
  IconCreditCard,
  IconMail,
  IconPhone,
  IconReceipt,
  IconWallet,
} from './icons.jsx'

export default function OrderItemsCard({ order, showContact = false }) {
  if (!order) return null

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-wash text-ink-soft">
            <IconReceipt className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-extrabold text-ink">Detalle del pedido</h2>
        </div>
        <span className="rounded-full bg-wash px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
          {order.items.reduce((sum, item) => sum + item.cantidad, 0)}{' '}
          {order.items.reduce((sum, item) => sum + item.cantidad, 0) === 1
            ? 'artículo'
            : 'artículos'}
        </span>
      </div>

      <ul className="divide-y divide-line px-5">
        {order.items.map((item, index) => (
          <li key={`${item.nombre}-${index}`} className="flex items-center gap-3 py-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-wash">
              <PizzaImage
                topping={item.topping}
                src={item.imagen}
                alt={item.nombre}
                className="h-full w-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">{item.nombre}</p>
              {(item.linea || item.tamano) && (
                <p className="mt-0.5 text-[11px] text-muted">
                  {[item.linea, item.tamano].filter(Boolean).join(' · ')}
                </p>
              )}
              <p className="mt-1 text-[11px] font-semibold text-muted">
                {item.cantidad} × {formatPrice(item.precio)}
              </p>
            </div>
            <span className="shrink-0 text-sm font-extrabold text-ink">
              {formatPrice(item.precio * item.cantidad)}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-line px-5 py-4 text-sm">
        <div className="flex items-center justify-between text-ink-soft">
          <span>Subtotal</span>
          <span className="font-semibold text-ink">
            {formatPrice(order.subtotal ?? order.total)}
          </span>
        </div>
        <div className="flex items-center justify-between text-ink-soft">
          <span>Recoger en tienda</span>
          <span className="font-semibold text-open">Gratis</span>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="font-bold text-ink">Total</span>
          <span className="text-xl font-extrabold text-ink">
            {formatPrice(order.total)}
          </span>
        </div>
        <p className="text-right text-[10px] text-muted">IVA incluido · MXN</p>
      </div>

      <div className="flex items-center gap-2.5 border-t border-line bg-wash/50 px-5 py-3.5">
        {order.metodoPago === 'ANTICIPADO' ? (
          <IconCreditCard className="h-4 w-4 text-brand" />
        ) : (
          <IconWallet className="h-4 w-4 text-brand" />
        )}
        <span className="text-[11px] font-semibold text-ink-soft">
          {paymentLabel(order.metodoPago)}
        </span>
        {order.pagado && (
          <span className="ml-auto rounded-full bg-open-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-open">
            Pagado
          </span>
        )}
      </div>

      {order.notas && (
        <div className="border-t border-line px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Notas para la cocina
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">{order.notas}</p>
        </div>
      )}

      {showContact && (order.clienteCorreo || order.clienteTelefono) && (
        <div className="space-y-2 border-t border-line px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Contacto
          </p>
          {order.clienteCorreo && (
            <p className="flex items-center gap-2 text-xs text-ink-soft">
              <IconMail className="h-3.5 w-3.5 text-muted" />
              {order.clienteCorreo}
            </p>
          )}
          {order.clienteTelefono && (
            <p className="flex items-center gap-2 text-xs text-ink-soft">
              <IconPhone className="h-3.5 w-3.5 text-muted" />
              {order.clienteTelefono}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
