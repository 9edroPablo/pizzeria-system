import { useEffect, useState } from 'react'
import AllergyBanner from './AllergyBanner.jsx'
import BottomNav from './BottomNav.jsx'
import CartDrawer from './CartDrawer.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import Hero from './Hero.jsx'
import MenuGrid from './MenuGrid.jsx'
import MobileCartBar from './MobileCartBar.jsx'
import { getMenu } from '../services/menuService.js'
import { getStoreStatus } from '../services/storeService.js'

export default function MenuScreen({ cart, onCheckout }) {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tienda, setTienda] = useState({ abierta: true, tiempoEspera: '90s' })
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [menu, estado] = await Promise.all([getMenu(), getStoreStatus()])
        if (cancelled) return
        setPizzas(menu)
        setTienda(estado)
      } catch {
        if (!cancelled) setError('No se pudo cargar el menú. Inténtalo de nuevo.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-cream pb-28 md:pb-0">
      <Header cartCount={cart.count} onOpenCart={() => setCartOpen(true)} abierto={tienda.abierta} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <Hero abierto={tienda.abierta} tiempoEspera={tienda.tiempoEspera} />

        {error ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-paper px-6 py-16 text-center">
            <p className="text-sm font-semibold text-ink">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <MenuGrid pizzas={pizzas} loading={loading} onAdd={cart.addItem} />
        )}

        <AllergyBanner />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        items={cart.items}
        subtotal={cart.subtotal}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onCheckout={() => {
          setCartOpen(false)
          onCheckout()
        }}
      />

      <MobileCartBar count={cart.count} subtotal={cart.subtotal} onOpen={() => setCartOpen(true)} />
      <BottomNav />
    </div>
  )
}
