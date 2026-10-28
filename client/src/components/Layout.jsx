import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CartDrawer from './CartDrawer.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import BottomNav from './BottomNav.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  const isCheckout = pathname.startsWith('/checkout')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  if (isCheckout) {
    return (
      <>
        <Outlet />
        <CartDrawer />
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <div className="h-16 md:hidden print:hidden" aria-hidden="true" />
      <BottomNav />
      <CartDrawer />
    </div>
  )
}
