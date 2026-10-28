import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  ORDER_FLOW,
  ORDER_STATUS_LABELS,
  getStatusIndex,
} from '../context/orderStatus.js'
import { DEMO_USER } from '../data/demoUser.js'
import { STORE } from '../data/store.js'
import { getCustomer } from '../services/customerService.js'
import { IS_MOCK } from '../services/dataSource.js'
import { formatPrice, formatRelativeTime } from '../services/format.js'
import {
  fetchOrderById,
  getFolio,
  getOrders,
  isMongoOrderId,
  resetLocalOrders,
} from '../services/orderService.js'
import PageHeader from './PageHeader.jsx'
import {
  IconArrowRight,
  IconBag,
  IconCalendar,
  IconChevronRight,
  IconClock,
  IconCreditCard,
  IconInfo,
  IconMail,
  IconMapPin,
  IconPhone,
  IconRefresh,
  IconShieldCheck,
} from './icons.jsx'

const STATUS_STYLES = {
  PENDIENTE: 'bg-brand-soft text-brand',
  EN_PREPARACION: 'bg-star/10 text-star',
  LISTO: 'bg-open-soft text-open',
  ENTREGADO: 'bg-wash text-muted',
}

export default function AccountScreen() {
  const { clearCart } = useCart()
  const { demoClosed, setDemoClosed } = useStore()
  const { notify } = useToast()
  const customer = useMemo(() => getCustomer(), [])
  const [orders, setOrders] = useState(() => getOrders())
  const [showAll, setShowAll] = useState(false)

  const displayName = IS_MOCK
    ? DEMO_USER.nombre
    : customer?.nombre?.trim() || 'Cliente'
  const firstName = displayName.split(/\s+/)[0]
  const initials = IS_MOCK
    ? DEMO_USER.iniciales
    : displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'CL'
  const email = IS_MOCK ? DEMO_USER.correo : customer?.correo ?? ''
  const phone = IS_MOCK ? DEMO_USER.telefono : customer?.telefono ?? ''
  const activeOrder = orders.find((order) => order.estado !== 'ENTREGADO')
  const visibleOrders = showAll ? orders : orders.slice(0, 4)
  const activeProgress = activeOrder
    ? ((getStatusIndex(activeOrder.estado) + 1) / ORDER_FLOW.length) * 100
    : 0

  const favoritePizza = useMemo(() => {
    const counts = new Map()
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        counts.set(
          item.nombre,
          (counts.get(item.nombre) ?? 0) + item.cantidad,
        )
      })
    })
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  }, [orders])

  const totalOrders = IS_MOCK ? DEMO_USER.pedidos : orders.length
  const favorite = IS_MOCK ? DEMO_USER.pizzaFavorita : favoritePizza

  useEffect(() => {
    if (IS_MOCK) return undefined

    let active = true
    const refreshOrders = async () => {
      const pending = getOrders().filter(
        (order) =>
          order.estado !== 'ENTREGADO' && isMongoOrderId(order.id),
      )
      if (pending.length === 0) return

      await Promise.allSettled(
        pending.map((order) => fetchOrderById(order.id)),
      )
      if (active) setOrders(getOrders())
    }

    refreshOrders()
    const interval = window.setInterval(refreshOrders, 15000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  const handleDemoClosed = async () => {
    const next = !demoClosed
    await setDemoClosed(next)
    notify(
      next
        ? 'La tienda ahora se muestra cerrada en toda la app.'
        : 'La tienda vuelve a mostrarse abierta.',
      { tone: 'info' },
    )
  }

  const handleReset = () => {
    resetLocalOrders()
    clearCart()
    setOrders(getOrders())
    setShowAll(false)
    notify('Pedidos locales y carrito restablecidos.', { tone: 'info' })
  }

  return (
    <>
      <PageHeader
        eyebrow="Mi cuenta"
        title={`Hola, ${firstName}`}
        description={
          IS_MOCK
            ? 'Aquí encontrarás tus pedidos, tu punto de recogida y las herramientas de esta demostración.'
            : 'Aquí encontrarás tus pedidos y tu punto de recogida.'
        }
        actions={
          <Link
            to="/seguimiento"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper px-5 py-3 text-sm font-bold text-ink transition hover:border-ink/25"
          >
            Seguir un pedido
            <IconArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="bg-ink px-5 pb-5 pt-6 text-white">
                <div className="flex items-center gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/15 bg-brand text-xl font-extrabold">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/70">
                      {IS_MOCK ? 'Cuenta demo' : 'Cliente'}
                    </span>
                    <h2 className="mt-1.5 truncate text-lg font-extrabold">
                      {displayName}
                    </h2>
                  </div>
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-white/60">
                  <IconCalendar className="h-3.5 w-3.5" />
                  {IS_MOCK
                    ? `Cliente desde ${DEMO_USER.desde}`
                    : 'Pedidos guardados en este dispositivo'}
                </p>
              </div>

              <div className="space-y-2.5 px-5 py-4">
                <p className="flex items-center gap-2.5 text-xs text-ink-soft">
                  <IconMail className="h-4 w-4 text-muted" />
                  {email || 'Agrega tu correo al hacer un pedido.'}
                </p>
                {phone && (
                  <p className="flex items-center gap-2.5 text-xs text-ink-soft">
                    <IconPhone className="h-4 w-4 text-muted" />
                    {phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 divide-x divide-line border-t border-line">
                <div className="px-4 py-4 text-center">
                  <p className="text-xl font-extrabold text-ink">{totalOrders}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                    Pedidos
                  </p>
                </div>
                <div className="px-4 py-4 text-center">
                  <p className="truncate text-xs font-extrabold text-ink">
                    {favorite}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                    Favorita
                  </p>
                </div>
              </div>

              <div className="border-t border-line p-4">
                <button
                  type="button"
                  onClick={() =>
                    notify('La edición de perfil llegará con el inicio de sesión.', {
                      tone: 'info',
                    })
                  }
                  className="w-full rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-ink transition hover:border-ink/25"
                >
                  Editar perfil
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <IconMapPin className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-extrabold text-ink">Punto de recogida</h2>
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
                Ver mapa
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>

            <section className="rounded-2xl border border-line bg-wash/60 p-5">
              <div className="flex items-center gap-2.5">
                <IconCreditCard className="h-4 w-4 text-brand" />
                <h2 className="text-sm font-extrabold text-ink">Pago</h2>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                No hay tarjetas guardadas. El pago del checkout es simulado y no se
                almacenan datos bancarios.
              </p>
            </section>

            {IS_MOCK && (
              <section className="rounded-2xl border border-line bg-paper p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-ink">Modo demostración</h2>
                    <p className="mt-0.5 text-[11px] text-muted">
                      Fuerza el estado de la tienda.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={demoClosed}
                    aria-label="Simular tienda cerrada"
                    onClick={handleDemoClosed}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      demoClosed ? 'bg-brand' : 'bg-line'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        demoClosed ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-muted">
                  {demoClosed
                    ? 'Ahora la tienda aparece cerrada y el checkout está bloqueado.'
                    : 'La tienda aparece abierta y se puede completar un pedido.'}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-ink-soft transition hover:border-ink/25 hover:text-ink"
                >
                  <IconRefresh className="h-3.5 w-3.5" />
                  Restablecer pedidos locales
                </button>
              </section>
            )}
          </aside>

          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl border border-star/20 bg-star/5 p-4">
              <IconInfo className="mt-0.5 h-5 w-5 shrink-0 text-star" />
              <div>
                <p className="text-sm font-extrabold text-ink">
                  {IS_MOCK
                    ? 'Estás en una cuenta de demostración'
                    : 'Historial de este dispositivo'}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {IS_MOCK
                    ? 'El registro e inicio de sesión reales llegarán cuando estén listos los diseños de Figma. Por ahora usamos datos de ejemplo.'
                    : 'Aquí aparecen los pedidos creados en este navegador. Para consultar otro pedido, usa su ID completo en Seguimiento.'}
                </p>
              </div>
            </div>

            {activeOrder ? (
              <Link
                to={`/seguimiento?pedido=${activeOrder.id}`}
                className="group relative block overflow-hidden rounded-2xl bg-ink p-5 text-white transition hover:bg-ink-soft sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-white/10"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                      Pedido en curso · {activeOrder.folio ?? getFolio(activeOrder)}
                    </p>
                    <h2 className="mt-1.5 text-xl font-extrabold">
                      {ORDER_STATUS_LABELS[activeOrder.estado]}
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      {activeOrder.items.reduce((sum, item) => sum + item.cantidad, 0)}{' '}
                      {activeOrder.items.reduce((sum, item) => sum + item.cantidad, 0) === 1
                        ? 'pizza'
                        : 'pizzas'}{' '}
                      · listo en {activeOrder.tiempoEstimado ?? 'unos minutos'}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-brand">
                    <IconChevronRight className="h-5 w-5" />
                  </span>
                </div>
                <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${activeProgress}%` }}
                  />
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wash text-muted">
                  <IconBag className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-ink">No tienes pedidos en curso</p>
                  <p className="mt-0.5 text-xs text-muted">
                    ¿Se antoja una Margarita recién horneada?
                  </p>
                </div>
                <Link
                  to="/menu"
                  className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-dark"
                >
                  Ver menú
                </Link>
              </div>
            )}

            <section className="overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <h2 className="text-sm font-extrabold text-ink">Pedidos recientes</h2>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {IS_MOCK
                      ? `${orders.length} pedidos entre historial demo y locales`
                      : `${orders.length} pedidos en este dispositivo`}
                  </p>
                </div>
                {orders.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAll((value) => !value)}
                    className="text-[11px] font-bold uppercase tracking-wider text-brand"
                  >
                    {showAll ? 'Ver menos' : 'Ver todos'}
                  </button>
                )}
              </div>

              {visibleOrders.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm font-bold text-ink">Aún no hay pedidos</p>
                  <p className="mt-1 text-xs text-muted">
                    Cuando hagas tu primer pedido aparecerá aquí.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {visibleOrders.map((order) => (
                    <li key={order.id}>
                      <Link
                        to={`/seguimiento?pedido=${order.id}`}
                        className="group flex items-center gap-3 px-5 py-4 transition hover:bg-wash/50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wash text-ink-soft">
                          <IconBag className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-extrabold text-ink">
                              {order.folio ?? getFolio(order)}
                            </p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                STATUS_STYLES[order.estado] ?? 'bg-wash text-muted'
                              }`}
                            >
                              {ORDER_STATUS_LABELS[order.estado] ?? order.estado}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-[11px] text-muted">
                            {order.items
                              .map((item) => `${item.cantidad}× ${item.nombre}`)
                              .join(' · ')}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
                            <IconClock className="h-3 w-3" />
                            {formatRelativeTime(order.creadoEn)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-ink">
                            {formatPrice(order.total)}
                          </p>
                          <IconChevronRight className="ml-auto mt-1 h-4 w-4 text-muted transition group-hover:text-brand" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-paper p-5">
                <IconShieldCheck className="h-5 w-5 text-open" />
                <h2 className="mt-2 text-sm font-extrabold text-ink">Privacidad</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {IS_MOCK
                    ? 'Los datos de esta cuenta son ficticios. El pago no se procesa y no se guardan datos de tarjeta.'
                    : 'El pago es simulado. No se guardan datos de tarjeta.'}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-5">
                <IconMail className="h-5 w-5 text-brand" />
                <h2 className="mt-2 text-sm font-extrabold text-ink">¿Algún cambio?</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Escríbenos a{' '}
                  <a
                    href={`mailto:${STORE.correo}`}
                    className="font-semibold text-brand hover:underline"
                  >
                    {STORE.correo}
                  </a>{' '}
                  y actualizamos tus datos.
                </p>
              </div>
            </div>

            {IS_MOCK && (
              <button
                type="button"
                onClick={() =>
                  notify('El inicio de sesión estará disponible próximamente.', {
                    tone: 'info',
                  })
                }
                className="w-full rounded-xl border border-line bg-paper py-3 text-xs font-bold text-muted transition hover:border-brand/30 hover:text-brand"
              >
                Cerrar sesión (demo)
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
