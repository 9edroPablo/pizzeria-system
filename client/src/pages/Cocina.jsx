import { useState } from 'react'
import OperativoHeader from '../components/operativo/OperativoHeader.jsx'
import { PaymentBadge, StatusBadge } from '../components/operativo/StatusBadge.jsx'
import { folio, minutosDesde } from '../components/operativo/utils.js'
import { ORDER_STATUS } from '../context/orderStatus.js'
import { useToast } from '../context/ToastContext.jsx'
import { usePolling } from '../hooks/usePolling.js'
import { formatTime } from '../services/format.js'
import { getErrorMessage } from '../services/http.js'
import { getKitchenOrders, updateOrderStatus } from '../services/operativoService.js'

// Minutos a partir de los cuales el pedido se marca como demorado.
const MINUTOS_ALERTA = 20

// Qué botón mostrar según el estado actual del pedido.
const SIGUIENTE_PASO = {
  [ORDER_STATUS.PENDIENTE]: {
    estado: ORDER_STATUS.EN_PREPARACION,
    label: 'Empezar preparación',
    clase: 'bg-amber-500 hover:bg-amber-600',
  },
  [ORDER_STATUS.EN_PREPARACION]: {
    estado: ORDER_STATUS.LISTO,
    label: 'Marcar como listo',
    clase: 'bg-open hover:brightness-95',
  },
}

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
      notify(
        paso.estado === ORDER_STATUS.LISTO
          ? `${folio(pedido)} listo para mostrador`
          : `${folio(pedido)} en preparación`,
      )
      await refresh()
    } catch (err) {
      notify(getErrorMessage(err), { tone: 'error' })
    } finally {
      setProcesando(null)
    }
  }

  const enPreparacion = pedidos.filter((p) => p.estado === ORDER_STATUS.EN_PREPARACION).length

  return (
    <div className="min-h-svh bg-cream">
      <OperativoHeader
        titulo="Cocina"
        subtitulo={`${pedidos.length} en cola · ${enPreparacion} en preparación`}
        lastUpdate={lastUpdate}
        onRefresh={refresh}
        otraPantalla={{ to: '/mostrador', label: 'Ir a Mostrador' }}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <p className="mb-5 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm font-semibold text-brand">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-muted">Cargando cola de cocina…</p>
        ) : pedidos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-paper py-16 text-center text-muted">
            No hay pedidos pendientes. La cocina está al día.
          </p>
        ) : (
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pedidos.map((pedido, index) => (
              <TarjetaCocina
                key={pedido._id}
                pedido={pedido}
                posicion={index + 1}
                ocupado={procesando === pedido._id}
                onAvanzar={() => avanzar(pedido)}
              />
            ))}
          </ol>
        )}
      </main>
    </div>
  )
}

function TarjetaCocina({ pedido, posicion, ocupado, onAvanzar }) {
  const paso = SIGUIENTE_PASO[pedido.estado]
  const minutos = minutosDesde(pedido.createdAt)
  const demorado = minutos >= MINUTOS_ALERTA

  return (
    <li
      className={`flex flex-col rounded-2xl border-2 bg-paper p-5 shadow-sm ${
        pedido.estado === ORDER_STATUS.EN_PREPARACION ? 'border-amber-400' : 'border-line'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-lg font-extrabold text-white">
            {posicion}
          </span>
          <div>
            <p className="text-2xl font-extrabold text-ink">{folio(pedido)}</p>
            <p className={`text-xs font-semibold ${demorado ? 'text-brand' : 'text-muted'}`}>
              {formatTime(pedido.createdAt)} · hace {minutos} min
              {demorado && ' · demorado'}
            </p>
          </div>
        </div>
        <StatusBadge estado={pedido.estado} />
      </div>

      <ul className="my-4 space-y-2 border-y border-line py-3">
        {pedido.items?.map((item, i) => (
          <li key={i} className="flex items-baseline gap-3 text-base">
            <span className="min-w-8 text-xl font-extrabold text-brand">{item.cantidad}×</span>
            <span className="font-semibold text-ink">{item.nombre}</span>
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <PaymentBadge pagado={pedido.pagado} metodoPago={pedido.metodo_pago} />
      </div>

      {paso && (
        <button
          type="button"
          onClick={onAvanzar}
          disabled={ocupado}
          className={`mt-auto w-full rounded-xl px-4 py-3 text-base font-bold text-white transition disabled:opacity-50 ${paso.clase}`}
        >
          {ocupado ? 'Actualizando…' : paso.label}
        </button>
      )}
    </li>
  )
}
