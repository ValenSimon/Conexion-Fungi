'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  quantity: number
  stock?: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Clave única para el LocalStorage de Conexión Fungi
const STORAGE_KEY = 'fungi-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // 1. Cargar carrito desde LocalStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY)
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error al parsear el carrito:", error)
      }
    }
  }, [])

  // 2. Guardar en LocalStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // 3. Agregar al carrito (Lógica corregida para cantidad dinámica)
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      
      // Si ya existe, sumamos la cantidad que viene del selector (product.quantity)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
            : item
        )
      }
      
      // Si es nuevo, lo agregamos con la cantidad que traiga el objeto
      return [...prev, { ...product, quantity: product.quantity || 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item))
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem(STORAGE_KEY)
  }

  // Cálculos derivados
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        totalPrice,
        cartCount 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider")
  return context
}