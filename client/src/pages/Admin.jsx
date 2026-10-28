import { useState } from 'react'
import OperativoLayout, { Aviso, StatCard } from '../components/operativo/OperativoLayout.jsx'
import { folio, formatMoney, nombreCliente } from '../components/operativo/utils.js'
import { IconExternalLink } from '../components/icons.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { usePolling } from '../hooks/usePolling.js'
import { formatDate, formatTime } from '../services/format.js'
import { getErrorMessage } from '../services/http.js'
import {
  getSalesHistory,
  getStoreStatus,
  updateStoreStatus,
} from '../services/operativoService.js'

export default function Admin() {
  const tienda = usePolling(getStoreStatus, 15000, null)
  const historial = usePolling(getSalesHistory, 15000, {
    totalVentas: 0,
    cantidad: 0,
    pedidos: [],
  })
  const { notify } = useToast()
  const [guardando, setGuardando] = useState(false)

  const abierta = Boolean(tienda.data?.tienda_abierta)
  const { totalVentas, cantidad, pedidos } = historial.data
  const ticketPromedio = cantidad > 0 ? totalVentas / cantidad : 0

  async function cambiarApertura() {
    setGuardando(true)
    try {
      const actualizado = await updateStoreStatus({ tienda_abierta: !abierta })
      tienda.setData(actualizado)
      notify(actualizado.tienda_abierta ? 'Sucursal abierta' : 'Sucursal cerrada')
    } catch (err) {
      notify(getErrorMessage(err), { tone: 'error' })
    } finally {
      setGuardando(false)
    }
  }

  const lastUpdate = historial.lastUpdate ?? tienda.lastUpdate
  const error = tienda.error || historial.error

  return (
    <OperativoLayout
      titulo="Administrador"
      descripcion="Controla la apertura de la sucursal y consulta el historial de ventas."
      lastUpdate={lastUpdate}
    >
      {error && <Aviso>{error}</Aviso>}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard valor={formatMoney(totalVentas)} etiqueta="Total de ventas" />
        <StatCard valor={cantidad} etiqueta="Pedidos entregados" />
        <StatCard valor={formatMoney(ticketPromedio)} etiqueta="Ticket promedio" />
      </div>

      {/* Apertura / cierre de la sucursal */}
      <section className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div>
          <p className="text-sm font-semibold">Estado de la sucursal</p>
          <p className="mt-1 text-xs text-[#7a4a3a]">
            {tienda.loading
              ? 'Consultando…'
              : abierta
                ? 'Abierta: los clientes pueden hacer pedidos.'
                : 'Cerrada: los clientes no pueden hacer pedidos.'}
          </p>
          {tienda.data?.ubicacion && (
            <a
              href={tienda.data.ubicacion}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-700 hover:underline"
            >
              Ver ubicación en Google Maps
              <IconExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded px-2 py-1 text-[11px] font-semibold ${
              abierta ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {abierta ? 'ABIERTA' : 'CERRADA'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={abierta}
            aria-label="Abrir o cerrar la sucursal"
            onClick={cambiarApertura}
            disabled={guardando || tienda.loading}
            className={`relative h-7 w-12 rounded-full transition disabled:opacity-60 ${
              abierta ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                abierta ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </section>

      {/* Historial de ventas */}
      <section className="mt-4 rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <p className="text-sm font-semibold">Historial de ventas</p>
          <p className="text-xs text-ink-soft">Solo pedidos entregados</p>
        </div>

        {historial.loading ? (
          <p className="py-12 text-center text-sm text-ink-soft">Cargando historial…</p>
        ) : pedidos.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-soft">Aún no hay ventas entregadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-ink-soft">
                <tr>
                  <th className="px-4 py-2 font-medium">Pedido</th>
                  <th className="px-4 py-2 font-medium">Cliente</th>
                  <th className="px-4 py-2 font-medium">Fecha</th>
                  <th className="px-4 py-2 font-medium">Productos</th>
                  <th className="px-4 py-2 font-medium">Pago</th>
                  <th className="px-4 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-semibold">{folio(p)}</td>
                    <td className="max-w-[180px] truncate px-4 py-3">{nombreCliente(p)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                      {formatDate(p.createdAt)} · {formatTime(p.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {p.items?.map((i) => `${i.cantidad} × ${i.nombre}`).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {p.metodo_pago === 'ANTICIPADO' ? 'En línea' : 'En tienda'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatMoney(p.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200">
                  <td colSpan={5} className="px-4 py-3 text-right text-xs font-semibold text-ink-soft">
                    Total de ventas
                  </td>
                  <td className="px-4 py-3 text-right text-base font-bold">
                    {formatMoney(totalVentas)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </OperativoLayout>
  )
}
