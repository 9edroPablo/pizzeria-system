import { useState } from 'react'
import OperativoLayout, { Aviso, StatCard } from '../components/operativo/OperativoLayout.jsx'
import { PriorityBadge, StatusCode } from '../components/operativo/StatusBadge.jsx'
import { IconChefHat, IconSort } from '../components/operativo/icons.jsx'
import { folio, minutosDesde } from '../components/operativo/utils.js'
import { IconCheck, IconClock } from '../components/icons.jsx'
import { ORDER_STATUS } from '../context/orderStatus.js'
import { useToast } from '../context/ToastContext.jsx'
import { usePolling } from '../hooks/usePolling.js'
import { formatTime } from '../services/format.js'
import { getErrorMessage } from '../services/http.js'
import { getKitchenOrders, updateOrderStatus } from '../services/operativoService.js'

// A partir de estos minutos de espera el pedido se marca "Prioridad alta".
const MINUTOS_PRIORIDAD_ALTA = 15

// Qué botón mostrar según el estado actual del pedido.
const SIGUIENTE_PASO = {
  [ORDER_STATUS.PENDIENTE]: {
    estado: ORDER_STATUS.EN_PREPARACION,
    label: 'Pasar a EN_PREPARACION',
    Icono: IconChefHat,
  },
  [ORDER_STATUS.EN_PREPARACION]: {
    estado: ORDER_STATUS.LISTO,
    label: 'Pasar a LISTO',
    Icono: IconCheck,
  },
}

const contarPizzas = (lista) =>
  lista.reduce(
    (total, p) => total + (p.items ?? []).reduce((s, i) => s + (Number(i.cantidad) || 0), 0),
    0,
  )

export default function Cocina() {
  // El backend ya los manda ordenados: pagados primero, luego los más antiguos.
  const { data: pedidos, loading, error, lastUpdate, refresh } = usePolling(
    getKitchenOrders,
    8000,
  )
  const { notify } = useToast()
  const [procesando, setProcesando] = useState(null)

  async function avanzar(pedido) {
    const paso = SIGUIENTE_PASO[pedido.estado]
    if (!paso) return
    setProcesando(pedido._id)
    try {
      await updateOrderStatus(pedido._id, paso.estado)
      notify(`${folio(pedido)} pasó a ${paso.estado}`)
      await refresh()
    } catch (err) {
      notify(getErrorMessage(err), { tone: 'error' })
    } finally {
      setProcesando(null)
    }
  }

  const pendientes = pedidos.filter((p) => p.estado === ORDER_STATUS.PENDIENTE).length
  const enPreparacion = pedidos.filter((p) => p.estado === ORDER_STATUS.EN_PREPARACION).length
  const pizzas = contarPizzas(pedidos)

  return (
    <OperativoLayout
      titulo="Cocina"
      descripcion="Prepara primero los pedidos con mayor prioridad y tiempo de espera."
      lastUpdate={lastUpdate}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard valor={pendientes} etiqueta="Pendientes" />
        <StatCard valor={enPreparacion} etiqueta="En preparación" />
        <StatCard valor={pizzas} etiqueta="Pizzas por preparar" />
      </div>

      <div className="mt-5 mb-3 flex items-center justify-between text-xs">
        <span className="font-semibold">
          {pedidos.length} {pedidos.length === 1 ? 'comanda' : 'comandas'} · {pizzas}{' '}
          {pizzas === 1 ? 'pizza' : 'pizzas'}
        </span>
        <span className="flex items-center gap-1.5 text-ink-soft">
          <IconSort className="h-3.5 w-3.5" />
          Prioridad y espera
        </span>
      </div>

      {error && <Aviso>{error}</Aviso>}

      {loading ? (
        <p className="py-16 text-center text-sm text-ink-soft">Cargando comandas…</p>
      ) : pedidos.length === 0 ? (
        <p className="rounded-xl bg-white py-16 text-center text-sm text-ink-soft">
          No hay comandas pendientes. La cocina está al día.
        </p>
      ) : (
        <ol className="grid gap-4 md:grid-cols-2">
          {pedidos.map((pedido) => (
            <TarjetaCocina
              key={pedido._id}
              pedido={pedido}
              ocupado={procesando === pedido._id}
              onAvanzar={() => avanzar(pedido)}
            />
          ))}
        </ol>
      )}
    </OperativoLayout>
  )
}

function TarjetaCocina({ pedido, ocupado, onAvanzar }) {
  const paso = SIGUIENTE_PASO[pedido.estado]
  const minutos = minutosDesde(pedido.createdAt)
  const alta = minutos >= MINUTOS_PRIORIDAD_ALTA
  const notas = pedido.notas || pedido.items?.map((i) => i.notas).filter(Boolean).join(' · ')

  return (
    <li className="flex flex-col rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-2xl font-bold">{folio(pedido)}</p>
        <PriorityBadge alta={alta} />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-[#7a4a3a]">Entrada · {formatTime(pedido.createdAt)}</span>
        <span className="flex items-center gap-1 font-semibold">
          <IconClock className="h-3.5 w-3.5" />
          {minutos} min de espera
        </span>
      </div>

      <ul className="mt-3 space-y-2 border-y border-gray-200 py-3">
        {pedido.items?.map((item, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-gray-100 text-base font-semibold">
              {item.cantidad}
            </span>
            <span className="text-lg font-medium">{item.nombre}</span>
          </li>
        ))}
      </ul>

      {notas && <p className="mt-3 text-xs text-[#7a4a3a]">{notas}</p>}

      <div className="mt-3 flex items-center justify-between text-xs text-[#7a4a3a]">
        <span>Estado actual</span>
        <StatusCode estado={pedido.estado} />
      </div>

      {paso && (
        <button
          type="button"
          onClick={onAvanzar}
          disabled={ocupado}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          <paso.Icono className="h-4 w-4" />
          {ocupado ? 'Actualizando…' : paso.label}
        </button>
      )}
    </li>
  )
}
