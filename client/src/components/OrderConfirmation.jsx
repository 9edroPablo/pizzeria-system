import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { getOrder } from '../services/orderService.js'
import { formatDate, formatPrice, formatTime } from '../services/format.js'
import {
  ORDER_STATUS_LABELS,
} from '../context/orderStatus.js'
import { STORE } from '../data/store.js'
import OrderItemsCard from './OrderItemsCard.jsx'
import { paymentLabel } from '../services/orderLabels.js'
import OrderStatusTimeline from './OrderStatusTimeline.jsx'
import {
  IconArrowRight,
  IconBag,
  IconCheck,
  IconClock,
  IconDownload,
  IconMapPin,
  IconReceipt,
  IconShieldCheck,
} from './icons.jsx'

function ReceiptPrint({ order }) {
  return (
    <div className="hidden print:block">
      <header className="flex items-start justify-between border-b-2 border-ink pb-5">
        <div>
          <p className="text-lg font-extrabold uppercase tracking-[0.12em]">
            Forno & Farina
          </p>
          <p className="mt-1 text-xs">{STORE.lema}</p>
          <p className="mt-2 text-xs">
            {STORE.direccion}, {STORE.colonia}, {STORE.ciudad} {STORE.codigoPostal}
          </p>
          <p className="text-xs">
            {STORE.telefonoVisible} · {STORE.correo}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
            Comprobante de pedido
          </p>
          <p className="mt-1 text-xl font-extrabold">{order.id}</p>
          <p className="mt-1 text-xs">
            {formatDate(order.creadoEn)} · {formatTime(order.creadoEn)}
          </p>
          <p className="mt-1 text-xs font-bold">
            {ORDER_STATUS_LABELS[order.estado] ?? order.estado}
          </p>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-6 text-xs">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider">Cliente</p>
          <p className="mt-1 font-bold">{order.clienteNombre || 'Cliente de demostración'}</p>
          {order.clienteCorreo && <p>{order.clienteCorreo}</p>}
          {order.clienteTelefono && <p>{order.clienteTelefono}</p>}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider">Recoger en</p>
          <p className="mt-1 font-bold">{STORE.direccion}</p>
          <p>
            {STORE.colonia}, {STORE.ciudad} {STORE.codigoPostal}
          </p>
          <p className="mt-1">Listo en {order.tiempoEstimado ?? STORE.tiempoEspera}</p>
        </div>
      </section>

      <table className="mt-7 w-full border-collapse text-xs">
        <thead>
          <tr className="border-y border-ink/30 text-left">
            <th className="py-2">Producto</th>
            <th className="py-2 text-center">Cantidad</th>
            <th className="py-2 text-right">Precio</th>
            <th className="py-2 text-right">Importe</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={`${item.nombre}-${index}`} className="border-b border-line">
              <td className="py-2">
                <span className="font-bold">{item.nombre}</span>
                <span className="block text-[10px] text-muted">
                  {[item.linea, item.tamano].filter(Boolean).join(' · ')}
                </span>
              </td>
              <td className="py-2 text-center">{item.cantidad}</td>
              <td className="py-2 text-right">{formatPrice(item.precio)}</td>
              <td className="py-2 text-right">
                {formatPrice(item.precio * item.cantidad)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 ml-auto w-64 text-xs">
        <div className="flex justify-between py-1">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal ?? order.total)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Recoger en tienda</span>
          <span>Gratis</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-ink pt-2 text-sm font-extrabold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="mt-1 text-right text-[10px] text-muted">IVA incluido · MXN</p>
      </div>

      <section className="mt-7 grid grid-cols-2 gap-6 border-t border-line pt-4 text-xs">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider">Pago</p>
          <p className="mt-1">{paymentLabel(order.metodoPago)}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider">
            Notas para la cocina
          </p>
          <p className="mt-1">{order.notas || 'Sin notas adicionales'}</p>
        </div>
      </section>

      <footer className="mt-10 border-t border-line pt-3 text-[10px] text-muted">
        Documento de demostración. El pago no se procesó y no se almacenaron datos
        de tarjeta. Gracias por elegir Forno & Farina.
      </footer>
    </div>
  )
}

export default function OrderConfirmation() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isNew = searchParams.get('nuevo') === '1'
  const order = useMemo(() => getOrder(id), [id])

  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wash text-muted">
          <IconReceipt className="h-7 w-7" />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">No encontramos ese pedido</h1>
        <p className="text-sm leading-relaxed text-muted">
          Revisa el código del pedido o consulta tu historial desde la sección de
          seguimiento.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/seguimiento"
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Ir a seguimiento
          </Link>
          <Link
            to="/menu"
            className="rounded-xl border border-line bg-paper px-5 py-2.5 text-sm font-bold text-ink transition hover:border-ink/25"
          >
            Ver menú
          </Link>
        </div>
      </div>
    )
  }

  const firstName = order.clienteNombre?.trim().split(/\s+/)[0]
  const statusLabel = ORDER_STATUS_LABELS[order.estado] ?? order.estado

  return (
    <>
      <ReceiptPrint order={order} />
      <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10 print:hidden">
        <section className="relative overflow-hidden rounded-3xl bg-ink px-6 py-8 text-white sm:px-9 sm:py-10">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand/20 blur-3xl"
        />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-open text-white">
              <IconCheck className="h-5 w-5" />
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
              {isNew ? 'Pedido confirmado' : `Pedido ${order.id}`}
            </span>
            <span className="rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
              {statusLabel}
            </span>
          </div>

          <h1 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            {isNew
              ? `¡Gracias${firstName ? `, ${firstName}` : ''}! Tu pizza ya está en la fila.`
              : `Tu pedido ${order.id}`}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
            {isNew
              ? 'Recibimos tu pedido y la cocina ya lo tiene en cuenta. Te avisaremos cuando esté listo para recoger.'
              : 'Consulta aquí el estado más reciente y los detalles de tu pedido.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold">
              <IconClock className="h-4 w-4 text-white/60" />
              Listo en {order.tiempoEstimado ?? '25–35 min'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold">
              <IconBag className="h-4 w-4 text-white/60" />
              Recoger en Roma Norte
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold">
              <IconReceipt className="h-4 w-4 text-white/60" />
              {paymentLabel(order.metodoPago)}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to={`/seguimiento?pedido=${order.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-ink transition hover:bg-cream"
            >
              Seguir mi pedido
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Volver al menú
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              title="Se abrirá el diálogo de impresión para guardar en PDF"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <IconDownload className="h-4 w-4" />
              Comprobante PDF
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <OrderItemsCard order={order} showContact />

        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-ink">Estado del pedido</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                {formatDate(order.creadoEn)} · {formatTime(order.creadoEn)}
              </span>
            </div>
            <div className="mt-4">
              <OrderStatusTimeline estado={order.estado} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <IconMapPin className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-ink">Punto de recogida</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {STORE.direccion}, {STORE.colonia}
                  <br />
                  {STORE.ciudad} {STORE.codigoPostal}
                </p>
                <Link
                  to="/ubicacion"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand"
                >
                  Ver ubicación
                  <IconArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>

          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-wash/60 p-4">
            <IconShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-open" />
            <p className="text-[11px] leading-relaxed text-muted">
              Este pedido es una demostración. El pago no se procesó y los datos
              mostrados son de ejemplo.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
