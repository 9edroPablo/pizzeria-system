/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useStore } from './StoreContext.jsx'
import { useToast } from './ToastContext.jsx'

const CART_KEY = 'forno:carrito'
const MAX_QUANTITY = 12

const CartContext = createContext(null)

function readCart() {
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item?.id && Number(item.cantidad) > 0)
      .map((item) => ({
        ...item,
        cantidad: Math.min(Number(item.cantidad) || 1, MAX_QUANTITY),
      }))
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const [open, setOpen] = useState(false)
  const { abierta } = useStore()
  const { notify } = useToast()

  useEffect(() => {
    try {
      if (items.length === 0) {
        window.localStorage.removeItem(CART_KEY)
      } else {
        window.localStorage.setItem(CART_KEY, JSON.stringify(items))
      }
    } catch {
      // El carrito sigue funcionando en memoria si el navegador lo bloquea.
    }
  }, [items])

  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])

  const addItem = useCallback(
    (pizza) => {
      if (!pizza?.disponible) {
        notify('Esta pizza no está disponible por el momento.', {
          tone: 'error',
        })
        return false
      }
      if (!abierta) {
        notify('La tienda está cerrada. Vuelve en nuestro próximo horario.', {
          tone: 'error',
        })
        return false
      }

      setItems((current) => {
        const existing = current.find((item) => item.id === pizza.id)
        if (existing) {
          return current.map((item) =>
            item.id === pizza.id
              ? {
                  ...item,
                  cantidad: Math.min(item.cantidad + 1, MAX_QUANTITY),
                }
              : item,
          )
        }
        return [
          ...current,
          {
            id: pizza.id,
            productoId: pizza.id,
            nombre: pizza.nombre,
            linea: pizza.linea,
            tamano: pizza.tamano,
            precio: Number(pizza.precio) || 0,
            topping: pizza.topping,
            cantidad: 1,
          },
        ]
      })

      notify(`${pizza.nombre} se agregó al carrito`)
      return true
    },
    [abierta, notify],
  )

  const updateQuantity = useCallback((id, quantity) => {
    const next = Math.min(Math.max(Number(quantity) || 0, 0), MAX_QUANTITY)
    setItems((current) =>
      next === 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id ? { ...item, cantidad: next } : item,
          ),
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.cantidad, 0),
    [items],
  )
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [items],
  )

  const value = {
    items,
    count,
    subtotal,
    open,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    maxQuantity: MAX_QUANTITY,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
