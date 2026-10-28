import { useMemo, useState } from 'react'
import OperativoLayout, { Aviso, StatCard } from '../components/operativo/OperativoLayout.jsx'
import { StatusBadge } from '../components/operativo/StatusBadge.jsx'
import { IconCash } from '../components/operativo/icons.jsx'
import { folio, formatMoney, nombreCliente } from '../components/operativo/utils.js'
import { IconCheck, IconClock, IconSearch } from '../components/icons.jsx'
import { ORDER_STATUS } from '../context/orderStatus.js'
import { useToast } from '../context/ToastContext.jsx'
import { usePolling } from '../hooks/usePolling.js'
import { formatTime } from '../services/format.js'
import { getErrorMessage } from '../services/http.js'
import {
  getActiveOrders,
  markOrderAsPaid,
  updateOrderStatus,
} from '../services/operativoService.js'

const esListo = (p) => p.estado === ORDER_STATUS.LISTO
const porCobrar = (p) => !p.pagado

const FILTROS = [
  { id: 'todos', label: 'Todos', test: () => true },
  { id: 'listos', label: 'Listos', test: esListo },
  { id: 'cobrar', label: 'Por cobrar', test: porCobrar },
]

export default function Mostrador() {
  const { data: pedidos, loading, error, lastUpdate, refresh } = usePolling(
    getActiveOrders,
    10000,
  )
  const { notify } = useToast()
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  // Id del pedido cuyo botón se está procesando, para deshabilitarlo.
  const [procesando, setProcesando] = useState(null)

  const resumen = useMemo(() => {
    const pendientes = pedidos.filter(porCobrar)
    return {
      activos: pedidos.length,
      listos: pedidos.filter(esListo).length,
      porCobrar: pendientes.length,
      montoPorCobrar: pendientes.reduce((sum, p) => sum + (Number(p.total) || 0), 0),
    }
  }, [pedidos])

  const visibles = useMemo(() => {
    const { test } = FILTROS.find((f) => f.id === filtro)
    const texto = busqueda.trim().toLowerCase()
    return pedidos
      .filter(test)
      .filter((p) => {
        if (!texto) return true
        return (
          folio(p).toLowerCase().includes(texto) ||
          nombreCliente(p).toLowerCase().includes(texto)
        )
      })
      // Como en el diseño: primero los pedidos más antiguos.
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [pedidos, filtro, busqueda])

  const conteo = {
    todos: resumen.activos,
    listos: resumen.listos,
    cobrar: resumen.porCobrar,
  }

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

  const cobrar = (pedido) =>
    ejecutar(
      pedido,
      () => markOrderAsPaid(pedido._id),
      `Cobro registrado: ${folio(pedido)} por ${formatMoney(pedido.total)}`,
    )

  const entregar = (pedido) =>
    ejecutar(
      pedido,
      () => updateOrderStatus(pedido._id, ORDER_STATUS.ENTREGADO),
      `Pedido ${folio(pedido)} entregado`,
    )

  return (
    <OperativoLayout
      titulo="Mostrador"
      descripcion="Gestiona el cobro y la entrega de los pedidos activos en sucursal."
      lastUpdate={lastUpdate}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard valor={resumen.activos} etiqueta="Pedidos activos" />
        <StatCard valor={resumen.listos} etiqueta="Listos para recoger" />
        <StatCard
          valor={resumen.porCobrar}
          etiqueta={`Pendientes de pago · ${formatMoney(resumen.montoPorCobrar)}`}
        />
      </div>

      <label className="mt-5 flex w-full max-w-xs items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
        <IconSearch className="h-4 w-4 text-ink-soft" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Número de pedido o cliente"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
              filtro === f.id
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 bg-white text-ink hover:bg-gray-50'
            }`}
          >
            {f.label} · {conteo[f.id]}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {error && <Aviso>{error}</Aviso>}

        {loading ? (
          <p className="py-16 text-center text-sm text-ink-soft">Cargando pedidos…</p>
        ) : visibles.length === 0 ? (
          <p className="rounded-xl bg-white py-16 text-center text-sm text-ink-soft">
            No hay pedidos en esta vista.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((pedido) => (
              <TarjetaMostrador
                key={pedido._id}
                pedido={pedido}
                ocupado={procesando === pedido._id}
                onCobrar={() => cobrar(pedido)}
                onEntregar={() => entregar(pedido)}
              />
            ))}
          </div>
        )}
      </div>
    </OperativoLayout>
  )
}

const BOTON = 'flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition'

function TarjetaMostrador({ pedido, ocupado, onCobrar, onEntregar }) {
  // Un solo botón por tarjeta, como en el diseño:
  // 1) si no está pagado -> Cobrar pedido
  // 2) si está pagado y LISTO -> Confirmar entrega
  // 3) si está pagado pero sigue en cocina -> Esperando a cocina (deshabilitado)
  let boton
  if (!pedido.pagado) {
    boton = (
      <button
        type="button"
        onClick={onCobrar}
        disabled={ocupado}
        className={`${BOTON} bg-red-600 text-white hover:bg-red-700 disabled:opacity-60`}
      >
        <IconCash className="h-4 w-4" />
        {ocupado ? 'Procesando…' : 'Cobrar pedido'}
      </button>
    )
  } else if (esListo(pedido)) {
    boton = (
      <button
        type="button"
        onClick={onEntregar}
        disabled={ocupado}
        className={`${BOTON} bg-red-600 text-white hover:bg-red-700 disabled:opacity-60`}
      >
        <IconCheck className="h-4 w-4" />
        {ocupado ? 'Procesando…' : 'Confirmar Entrega'}
      </button>
    )
  } else {
    boton = (
      <button type="button" disabled className={`${BOTON} cursor-default bg-gray-100 text-ink-soft`}>
        <IconClock className="h-4 w-4" />
        Esperando a cocina
      </button>
    )
  }

  return (
    <article className="flex flex-col rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-2xl font-bold">{folio(pedido)}</p>
        <StatusBadge estado={pedido.estado} />
      </div>

      <p className="mt-2 truncate text-sm font-semibold">{nombreCliente(pedido)}</p>
      <p className="mt-1 text-xs text-[#7a4a3a]">
        Recogida en sucursal · {formatTime(pedido.createdAt)}
      </p>

      <ul className="mt-2 space-y-0.5 text-sm">
        {pedido.items?.map((item, i) => (
          <li key={i}>
            {item.cantidad} × {item.nombre}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <div className="flex items-end justify-between border-t border-gray-200 pt-3">
          <div>
            <p className="text-xs text-[#7a4a3a]">
              Pago · {pedido.metodo_pago === 'ANTICIPADO' ? 'En línea' : 'En tienda'}
            </p>
            <p className="text-sm font-semibold">{pedido.pagado ? 'Pagado' : 'Pendiente de pago'}</p>
          </div>
          <p className="text-xl font-bold">{formatMoney(pedido.total)}</p>
        </div>
        <div className="mt-3">{boton}</div>
      </div>
    </article>
  )
}
