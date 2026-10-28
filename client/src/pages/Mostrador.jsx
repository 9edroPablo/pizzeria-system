import { useMemo, useState } from 'react'
import OperativoHeader from '../components/operativo/OperativoHeader.jsx'
import { PaymentBadge, StatusBadge } from '../components/operativo/StatusBadge.jsx'
import { folio } from '../components/operativo/utils.js'
import { ORDER_STATUS } from '../context/orderStatus.js'
import { useToast } from '../context/ToastContext.jsx'
import { usePolling } from '../hooks/usePolling.js'
import { formatPrice, formatTime } from '../services/format.js'
import { getErrorMessage } from '../services/http.js'
import {
  getActiveOrders,
  markOrderAsPaid,
  updateOrderStatus,
} from '../services/operativoService.js'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'cobrar', label: 'Por cobrar' },
  { id: 'entregar', label: 'Listos para entregar' },
  { id: 'cocina', label: 'En cocina' },
]

function aplicarFiltro(pedidos, filtro) {
  switch (filtro) {
    case 'cobrar':
      return pedidos.filter((p) => !p.pagado)
    case 'entregar':
      return pedidos.filter((p) => p.estado === ORDER_STATUS.LISTO)
    case 'cocina':
      return pedidos.filter(
        (p) =>
          p.estado === ORDER_STATUS.PENDIENTE ||
          p.estado === ORDER_STATUS.EN_PREPARACION,
      )
    default:
      return pedidos
  }
}

export default function Mostrador() {
  const { data: pedidos, loading, error, lastUpdate, refresh } = usePolling(
    getActiveOrders,
    10000,
  )
  const { notify } = useToast()
  const [filtro, setFiltro] = useState('todos')
  // Guarda el id del pedido cuyo botón está procesando, para deshabilitarlo.
  const [procesando, setProcesando] = useState(null)

  const visibles = useMemo(() => aplicarFiltro(pedidos, filtro), [pedidos, filtro])

  const conteo = useMemo(
    () => ({
      todos: pedidos.length,
      cobrar: aplicarFiltro(pedidos, 'cobrar').length,
      entregar: aplicarFiltro(pedidos, 'entregar').length,
      cocina: aplicarFiltro(pedidos, 'cocina').length,
    }),
    [pedidos],
  )

  async function ejecutar(pedido, accion, mensajeExito) {
    setProcesando(pedido._id)
    try {
      await accion()
      notify(mensajeExito)
      await refresh()
    } catch (err) {
      notify(getErrorMessage(err), { tone: 'error' })
    } finally {
      setProcesando(null)
    }
  }

  const registrarCobro = (pedido) =>
    ejecutar(
      pedido,
      () => markOrderAsPaid(pedido._id),
      `Cobro registrado: ${folio(pedido)} por ${formatPrice(pedido.total)}`,
    )

  const confirmarEntrega = (pedido) =>
    ejecutar(
      pedido,
      () => updateOrderStatus(pedido._id, ORDER_STATUS.ENTREGADO),
      `Pedido ${folio(pedido)} entregado`,
    )

  return (
    <div className="min-h-svh bg-cream">
      <OperativoHeader
        titulo="Mostrador"
        subtitulo="Pedidos activos en sucursal"
        lastUpdate={lastUpdate}
        onRefresh={refresh}
        otraPantalla={{ to: '/cocina', label: 'Ir a Cocina' }}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filtro === f.id
                  ? 'bg-ink text-white'
                  : 'border border-line bg-paper text-ink-soft hover:border-ink/30'
              }`}
            >
              {f.label}
              <span className="ml-2 opacity-70">{conteo[f.id]}</span>
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-5 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm font-semibold text-brand">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-muted">Cargando pedidos…</p>
        ) : visibles.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-paper py-16 text-center text-muted">
            No hay pedidos en esta vista.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((pedido) => (
              <TarjetaMostrador
                key={pedido._id}
                pedido={pedido}
                ocupado={procesando === pedido._id}
                onCobrar={() => registrarCobro(pedido)}
                onEntregar={() => confirmarEntrega(pedido)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function TarjetaMostrador({ pedido, ocupado, onCobrar, onEntregar }) {
  const listo = pedido.estado === ORDER_STATUS.LISTO
  // Solo se entrega si ya está listo en cocina y ya está pagado.
  const puedeEntregar = listo && pedido.pagado

  let ayudaEntrega = ''
  if (!listo) ayudaEntrega = 'Se habilita cuando cocina lo marque como listo.'
  else if (!pedido.pagado) ayudaEntrega = 'Registra el cobro antes de entregar.'

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-paper p-5 shadow-sm ${
        listo ? 'border-open/40' : 'border-line'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold text-ink">{folio(pedido)}</p>
          <p className="text-xs text-muted">
            {formatTime(pedido.createdAt)} · {pedido.cliente_correo}
          </p>
        </div>
        <StatusBadge estado={pedido.estado} />
      </div>

      <ul className="my-4 space-y-1 border-y border-line py-3 text-sm">
        {pedido.items?.map((item, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span className="text-ink-soft">
              {item.cantidad} × {item.nombre}
            </span>
            <span className="text-muted">{formatPrice(item.precio * item.cantidad)}</span>
          </li>
        ))}
      </ul>

      <div className="mb-4 flex items-center justify-between">
        <PaymentBadge pagado={pedido.pagado} metodoPago={pedido.metodo_pago} />
        <span className="text-lg font-extrabold text-ink">{formatPrice(pedido.total)}</span>
      </div>

      <div className="mt-auto space-y-2">
        {!pedido.pagado && (
          <button
            type="button"
            onClick={onCobrar}
            disabled={ocupado}
            className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            {ocupado ? 'Procesando…' : `Registrar cobro · ${formatPrice(pedido.total)}`}
          </button>
        )}
        <button
          type="button"
          onClick={onEntregar}
          disabled={!puedeEntregar || ocupado}
          className="w-full rounded-xl bg-open px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-wash disabled:text-muted"
        >
          Confirmar entrega
        </button>
        {ayudaEntrega && <p className="text-center text-xs text-muted">{ayudaEntrega}</p>}
      </div>
    </article>
  )
}
