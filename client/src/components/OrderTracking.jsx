import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ORDER_FLOW,
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_LABELS,
  getStatusIndex,
} from '../context/orderStatus.js'
import { useToast } from '../context/ToastContext.jsx'
import { STORE } from '../data/store.js'
import {
  advanceOrderStatus,
  getLatestOrder,
  getOrder,
} from '../services/orderService.js'
import { formatDate, formatTime } from '../services/format.js'
import OrderItemsCard from './OrderItemsCard.jsx'
import { paymentLabel } from '../services/orderLabels.js'
import OrderStatusTimeline from './OrderStatusTimeline.jsx'
import PageHeader from './PageHeader.jsx'
import {
  IconAlert,
  IconArrowRight,
  IconClock,
  IconMapPin,
  IconPhone,
  IconRefresh,
  IconSearch,
  IconShieldCheck,
} from './icons.jsx'

function MapPreview() {
  return (
    <div className="relative h-32 overflow-hidden rounded-xl border border-line bg-wash">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(#e6e3db 1px, transparent 1px), linear-gradient(90deg, #e6e3db 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-[18%] top-0 h-full w-3 -rotate-12 bg-paper/80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[58%] h-3 -rotate-3 bg-paper/80"
      />
      <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-paper bg-brand text-white shadow-lg">
        <IconMapPin className="h-4 w-4" />
      </div>
      <span className="absolute bottom-2 left-2 rounded bg-paper/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-ink-soft">
        Roma Norte · CDMX
      </span>
    </div>
  )
}

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialId = searchParams.get('pedido') || getLatestOrder()?.id || ''
  const [orderId, setOrderId] = useState(initialId)
  const [order, setOrder] = useState(() => getOrder(initialId))
  const [query, setQuery] = useState(initialId)
  const [searchError, setSearchError] = useState('')
  const { notify } = useToast()

  useEffect(() => {
    if (!orderId) return undefined

    const interval = window.setInterval(() => {
      setOrder(getOrder(orderId))
    }, 6000)

    return () => window.clearInterval(interval)
  }, [orderId])

  const currentIndex = useMemo(
    () => getStatusIndex(order?.estado),
    [order?.estado],
  )

  const handleSearch = (event) => {
    event.preventDefault()
    const code = query.trim().toUpperCase()
    if (!code) {
      setSearchError('Escribe un código de pedido.')
      return
    }

    const found = getOrder(code)
    if (!found) {
      setSearchError(`No encontramos el pedido ${code}. Revisa el código e intenta de nuevo.`)
      setOrder(null)
      setOrderId('')
      setSearchParams({})
      return
    }

    setSearchError('')
    setOrder(found)
    setOrderId(found.id)
    setQuery(found.id)
    setSearchParams({ pedido: found.id })
  }

  const handleRefresh = () => {
    setOrder(getOrder(orderId))
    notify('Estado actualizado', { tone: 'info' })
  }

  const handleAdvance = () => {
    if (!order) return
    const updated = advanceOrderStatus(order.id)
    if (updated) {
      setOrder(getOrder(updated.id))
      notify(`Estado actualizado a ${ORDER_STATUS_LABELS[updated.estado]}`)
    }
  }

  const delivered = order?.estado === 'ENTREGADO'
  const progress = order ? ((currentIndex + 1) / ORDER_FLOW.length) * 100 : 0

  return (
    <>
      <PageHeader
        eyebrow="Seguimiento"
        title="Tu pedido, paso a paso"
        description="Consulta el estado de tu pizza y el tiempo estimado para recogerla en el mostrador."
        actions={
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Hacer otro pedido
            <IconArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-5">
            {order ? (
              <>
                <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-8">
                  <div
                    aria-hidden="true"
                    className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-20 right-10 h-40 w-40 rounded-full bg-brand/20 blur-2xl"
                  />

                  <div className="relative">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                          Pedido {order.id}
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                          {delivered
                            ? '¡Pedido entregado!'
                            : ORDER_STATUS_LABELS[order.estado]}
                        </h2>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                          {ORDER_STATUS_DESCRIPTIONS[order.estado]}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                          delivered
                            ? 'bg-open text-white'
                            : order.estado === 'LISTO'
                              ? 'bg-star text-ink'
                              : 'bg-brand text-white'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {ORDER_STATUS_LABELS[order.estado]}
                      </span>
                    </div>

                    <div className="mt-7">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/50">
                        <span>Progreso</span>
                        <span className="text-white/80">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            delivered ? 'bg-open' : 'bg-brand'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-4 gap-1.5">
                        {ORDER_FLOW.map((status, index) => (
                          <span
                            key={status}
                            className={`text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${
                              index <= currentIndex ? 'text-white/90' : 'text-white/30'
                            }`}
                          >
                            {ORDER_STATUS_LABELS[status]}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold">
                        <IconClock className="h-4 w-4 text-white/60" />
                        {delivered
                          ? `Entregado · ${formatTime(order.actualizadoEn ?? order.creadoEn)}`
                          : `Listo en ${order.tiempoEstimado ?? STORE.tiempoEspera}`}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold">
                        <IconMapPin className="h-4 w-4 text-white/60" />
                        {STORE.colonia} · CDMX
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-white/10"
                      >
                        <IconRefresh className="h-3.5 w-3.5" />
                        Actualizar
                      </button>
                      {order.simulado && !delivered && (
                        <button
                          type="button"
                          onClick={handleAdvance}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-[11px] font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                          Avanzar estado (demo)
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-extrabold text-ink">
                      Línea de tiempo
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      {formatDate(order.creadoEn)} · {formatTime(order.creadoEn)}
                    </span>
                  </div>
                  <div className="mt-5">
                    <OrderStatusTimeline estado={order.estado} />
                  </div>
                </section>

                <OrderItemsCard order={order} />

                {order.simulado && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-line bg-wash/60 p-4">
                    <IconShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-open" />
                    <p className="text-[11px] leading-relaxed text-muted">
                      Seguimiento de demostración: el estado avanza automáticamente
                      cada 40 segundos. En producción se leerá desde la base de datos.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-paper px-6 py-20 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <IconAlert className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-ink">
                    No encontramos ese pedido
                  </h2>
                  <p className="mt-1 max-w-sm text-sm text-muted">
                    Busca por código en el panel de la derecha o revisa el historial
                    desde tu cuenta.
                  </p>
                </div>
                <Link
                  to="/menu"
                  className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
                >
                  Volver al menú
                </Link>
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-line bg-paper p-5">
              <h2 className="text-sm font-extrabold text-ink">Buscar un pedido</h2>
              <p className="mt-1 text-xs text-muted">
                Ingresa el código que aparece en tu confirmación.
              </p>
              <form onSubmit={handleSearch} className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setSearchError('')
                    }}
                    aria-label="Código de pedido"
                    placeholder="FF-0000"
                    className="w-full rounded-xl border border-line bg-paper py-2.5 pl-9 pr-3 text-sm font-semibold uppercase tracking-wide text-ink outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-ink px-4 text-xs font-bold text-white transition hover:bg-ink-soft"
                >
                  Buscar
                </button>
              </form>
              {searchError && (
                <p role="alert" className="mt-2 text-[11px] font-semibold text-brand">
                  {searchError}
                </p>
              )}
              <p className="mt-3 text-[10px] text-muted">
                Prueba con el pedido de ejemplo{' '}
                <button
                  type="button"
                  onClick={() => {
                    setQuery('FF-4892')
                    const found = getOrder('FF-4892')
                    if (found) {
                      setOrder(found)
                      setOrderId(found.id)
                      setSearchError('')
                      setSearchParams({ pedido: found.id })
                    }
                  }}
                  className="font-bold text-brand underline underline-offset-2"
                >
                  FF-4892
                </button>
                .
              </p>
            </section>

            <section className="rounded-2xl border border-line bg-paper p-5">
              <h2 className="text-sm font-extrabold text-ink">Recoger en tienda</h2>
              <div className="mt-3">
                <MapPreview />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {STORE.direccion}, {STORE.colonia}
                <br />
                {STORE.ciudad} {STORE.codigoPostal}
              </p>
              <Link
                to="/ubicacion"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand"
              >
                Ver cómo llegar
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>

            <section className="rounded-2xl border border-line bg-wash/60 p-5">
              <h2 className="text-sm font-extrabold text-ink">¿Necesitas ayuda?</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Escríbenos o llama al mostrador si tu pedido tiene algún detalle.
              </p>
              <a
                href={`tel:${STORE.telefono}`}
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-ink transition hover:text-brand"
              >
                <IconPhone className="h-4 w-4 text-brand" />
                {STORE.telefonoVisible}
              </a>
              <p className="mt-2 text-[10px] text-muted">
                Pedido {order?.id ?? '—'} · {paymentLabel(order?.metodoPago)}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
