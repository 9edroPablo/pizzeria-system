import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getMenu } from '../services/menuService.js'
import AllergyBanner from './AllergyBanner.jsx'
import ClosedStoreBanner from './ClosedStoreBanner.jsx'
import Hero from './Hero.jsx'
import MenuGrid from './MenuGrid.jsx'
import MobileCartBar from './MobileCartBar.jsx'
import { IconAlert, IconRefresh } from './icons.jsx'

export default function MenuScreen() {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [linea, setLinea] = useState('Todas')
  const { abierta } = useStore()
  const { addItem } = useCart()

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const menu = await getMenu()
        if (active) setPizzas(menu)
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No se pudo cargar el menú.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [reloadKey])

  const lineas = useMemo(
    () => ['Todas', ...new Set(pizzas.map((pizza) => pizza.linea))],
    [pizzas],
  )

  const visibles = useMemo(
    () =>
      linea === 'Todas'
        ? pizzas
        : pizzas.filter((pizza) => pizza.linea === linea),
    [pizzas, linea],
  )

  return (
    <>
      <Hero total={pizzas.length} />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-10">
        <ClosedStoreBanner />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Pizzas artesanales
            </h2>
            <p className="mt-1 text-sm text-muted">
              {loading
                ? 'Cargando el menú del día…'
                : `${visibles.length} de ${pizzas.length} pizzas · precios en MXN`}
            </p>
          </div>

          {!loading && lineas.length > 1 && (
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {lineas.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLinea(item)}
                  aria-pressed={linea === item}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                    linea === item
                      ? 'border-ink bg-ink text-white'
                      : 'border-line bg-paper text-ink-soft hover:border-ink/25 hover:text-ink'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          {error ? (
            <div className="rounded-2xl border border-brand/20 bg-brand-soft p-6 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-paper text-brand">
                <IconAlert className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-bold text-ink">
                No pudimos cargar el menú
              </p>
              <p className="mt-1 text-xs text-muted">{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-bold text-white transition hover:bg-ink-soft"
              >
                <IconRefresh className="h-4 w-4" />
                Volver a intentar
              </button>
            </div>
          ) : (
            <MenuGrid
              pizzas={visibles}
              loading={loading}
              onAdd={addItem}
              abierta={abierta}
            />
          )}
        </div>

        {!loading && !error && (
          <p className="mt-6 text-center text-xs text-muted">
            Todos los pedidos son para recoger en el mostrador. Tiempo estimado
            sujeto a la carga del horno.
          </p>
        )}

        <AllergyBanner />
      </div>

      <MobileCartBar />
    </>
  )
}
