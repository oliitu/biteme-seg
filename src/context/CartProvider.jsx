import { useState } from 'react'
import { CartContext } from './CartContext'

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id)
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const value = { items, total, addToCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
