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
import { IS_MOCK } from '../services/dataSource.js'
import { formatDate, formatTime } from '../services/format.js'
import { getErrorMessage } from '../services/http.js'
import {
  fetchOrderById,
  getFolio,
  getLatestOrder,
  getOrder,
  getWaitTime,
  isMongoOrderId,
} from '../services/orderService.js'
import OrderItemsCard from './OrderItemsCard.jsx'
import { paymentLabel } from '../services/orderLabels.js'
import OrderStatusTimeline from './OrderStatusTimeline.jsx'
import PageHeader from './PageHeader.jsx'
import {
  IconAlert,
  IconArrowRight,
  IconBag,
  IconClock,
  IconMapPin,
  IconPhone,
  IconRefresh,
  IconSearch,
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
  const initialParam = searchParams.get('pedido') ?? ''
  const latestOrder = getLatestOrder()
  const initialOrder = initialParam ? getOrder(initialParam) : latestOrder
  const initialId = initialOrder?.id ?? initialParam
  const [orderId, setOrderId] = useState(initialId)
  const [order, setOrder] = useState(initialOrder)
  const [query, setQuery] = useState(initialOrder?.folio ?? initialParam)
  const [searchError, setSearchError] = useState('')
  const [waitInfo, setWaitInfo] = useState(null)
  const [loading, setLoading] = useState(Boolean(initialId) && !initialOrder)
  const [refreshing, setRefreshing] = useState(false)
  const { notify } = useToast()

  useEffect(() => {
    if (!orderId) return undefined

    let active = true

    const load = async ({ silent = false } = {}) => {
      if (!silent) setLoading(true)
      try {
        const [nextOrder, nextWait] = await Promise.all([
          fetchOrderById(orderId),
          getWaitTime().catch(() => null),
        ])
        if (!active) return
        if (nextOrder) {
          setOrder(nextOrder)
          setQuery(nextOrder.folio ?? nextOrder.id)
        }
        if (nextWait) setWaitInfo(nextWait)
        setSearchError('')
      } catch (requestError) {
        if (!active) return
        if (!getOrder(orderId)) setOrder(null)
        setSearchError(getErrorMessage(requestError))
      } finally {
        if (active && !silent) setLoading(false)
      }
    }

    load()
    const interval = window.setInterval(() => load({ silent: true }), 8000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [orderId])

  const currentIndex = useMemo(
    () => getStatusIndex(order?.estado),
    [order?.estado],
  )

  const estimate =
    waitInfo?.tiempoEstimadoMin != null
      ? `~${waitInfo.tiempoEstimadoMin} min`
      : order?.tiempoEstimado ?? null

  const handleSearch = async (event) => {
    event.preventDefault()
    const code = query.trim()
    if (!code) {
      setSearchError('Escribe un folio o el ID completo del pedido.')
      return
    }

    setSearchError('')
    const local = getOrder(code)
    if (local) {
      setOrder(local)
      setOrderId(local.id)
      setQuery(local.folio ?? local.id)
      setSearchParams({ pedido: local.id })
      return
    }

    if (isMongoOrderId(code)) {
      setLoading(true)
      try {
        const found = await fetchOrderById(code)
        if (!found) {
          setSearchError('No encontramos ese pedido en el servidor.')
          setOrder(null)
          setOrderId('')
          setSearchParams({})
          return
        }
        setOrder(found)
        setOrderId(found.id)
        setQuery(found.folio ?? found.id)
        setSearchParams({ pedido: found.id })
      } catch (requestError) {
        setSearchError(getErrorMessage(requestError))
      } finally {
        setLoading(false)
      }
      return
    }

    setSearchError(
      'Ese folio no está guardado en este dispositivo. Pega el ID completo de 24 caracteres para consultar el servidor.',
    )
    setOrder(null)
    setOrderId('')
    setSearchParams({})
  }

  const handleRefresh = async () => {
    if (!orderId) return
    setRefreshing(true)
    try {
      const [nextOrder, nextWait] = await Promise.all([
        fetchOrderById(orderId),
        getWaitTime().catch(() => null),
      ])
      if (nextOrder) setOrder(nextOrder)
      if (nextWait) setWaitInfo(nextWait)
      notify(
        nextOrder ? 'Estado actualizado' : 'No se pudo actualizar el pedido',
        { tone: nextOrder ? 'info' : 'error' },
      )
    } catch (requestError) {
      notify(getErrorMessage(requestError), { tone: 'error' })
    } finally {
      setRefreshing(false)
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
            {loading && !order ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper px-6 py-20 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-wash text-muted">
                  <IconRefresh className="h-6 w-6 animate-spin" />
                </span>
                <h2 className="text-lg font-extrabold text-ink">
                  Cargando tu pedido…
                </h2>
                <p className="text-sm text-muted">
                  Consultando el estado con la pizzería.
                </p>
              </div>
            ) : order ? (
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
                          Pedido {order.folio ?? getFolio(order)}
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
                          : `Listo en ${estimate ?? 'unos minutos'}`}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold">
                        <IconMapPin className="h-4 w-4 text-white/60" />
                        {STORE.colonia} · CDMX
                      </span>
                      {waitInfo?.pedidosActivos != null && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold">
                          <IconBag className="h-4 w-4 text-white/60" />
                          {waitInfo.pedidosActivos}{' '}
                          {waitInfo.pedidosActivos === 1
                            ? 'pedido activo'
                            : 'pedidos activos'}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-white/10 disabled:opacity-60"
                      >
                        <IconRefresh
                          className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
                        />
                        {refreshing ? 'Actualizando…' : 'Actualizar'}
                      </button>
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
                    Busca por folio en el panel de la derecha o revisa el historial
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
                Ingresa el folio de tu confirmación o el ID completo del pedido.
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
                    aria-label="Folio o ID de pedido"
                    placeholder="#A1B2 o ID completo"
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
                {IS_MOCK ? (
                  <>
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
                  </>
                ) : (
                  'El folio se guarda en este dispositivo. Para consultar otro pedido, pega su ID completo.'
                )}
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
                Pedido{' '}
                {order ? (order.folio ?? getFolio(order)) : '—'} ·{' '}
                {paymentLabel(order?.metodoPago)}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
