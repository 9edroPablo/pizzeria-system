import { Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Layout from './components/Layout.jsx'
import Menu from './pages/Menu.jsx'
import Checkout from './pages/Checkout.jsx'
import Pedido from './pages/Pedido.jsx'
import Seguimiento from './pages/Seguimiento.jsx'
import Ubicacion from './pages/Ubicacion.jsx'
import Cuenta from './pages/Cuenta.jsx'
import Mostrador from './pages/Mostrador.jsx'
import Cocina from './pages/Cocina.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/menu" replace />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido/:id" element={<Pedido />} />
              <Route path="/seguimiento" element={<Seguimiento />} />
              <Route path="/ubicacion" element={<Ubicacion />} />
              <Route path="/cuenta" element={<Cuenta />} />
            </Route>
            <Route path="/mostrador" element={<Mostrador />} />
            <Route path="/cocina" element={<Cocina />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/menu" replace />} />
          </Routes>
        </CartProvider>
      </StoreProvider>
    </ToastProvider>
  )
}

export default App
