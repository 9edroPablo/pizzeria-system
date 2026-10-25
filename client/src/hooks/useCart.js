import { useCallback, useMemo, useState } from 'react'

// Carrito de demostración con la misma forma que tendrá el CartContext de Raúl,
// para poder reemplazarlo sin tocar las pantallas:
//   items, addItem(pizza), updateQuantity(id, cantidad), removeItem(id),
//   clear(), count, subtotal
export function useCart() {
  const [items, setItems] = useState([])

  const addItem = useCallback((pizza) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === pizza.id)
      if (existing) {
        return current.map((item) =>
          item.id === pizza.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        )
      }
      return [...current, { ...pizza, cantidad: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((id, cantidad) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item,
      ),
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.precio * item.cantidad, 0),
    [items],
  )

  return { items, addItem, updateQuantity, removeItem, clear, count, subtotal }
}
