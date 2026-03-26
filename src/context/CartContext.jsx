import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.title === product.title)
      if (existing) {
        return prev.map((i) =>
          i.title === product.title ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((title) => {
    setItems((prev) => prev.filter((i) => i.title !== title))
  }, [])

  const updateQty = useCallback((title, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.title !== title))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.title === title ? { ...i, qty } : i))
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, cartOpen, setCartOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
