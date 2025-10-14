  import { createContext, useState, useEffect } from "react";


  export const CartContext = createContext();

  export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    
    useEffect(() => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          setCart([]);
        }
      }
    }, []);

    // ✅ Guardar carrito en localStorage cada vez que cambia
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // ✅ Calcular total
    const cartTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // ✅ Calcular cantidad total de items
    const cartItemsCount = cart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    // ✅ Agregar producto
    const addToCart = (product) => {
  setCart((prevCart) => {
    const existing = prevCart.find((item) => item.id === product.id);
    if (existing) {
      // Si ya existe, solo aumentar si no supera el stock
      if (existing.quantity < product.stock) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return prevCart; // no agregar más
      }
    }
    // Solo agregar si hay stock
    if (product.stock > 0) {
      return [...prevCart, { ...product, quantity: 1 }];
    }
    return prevCart;
  });
};

    // ✅ Eliminar producto
    const removeFromCart = (id) => {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    // ✅ Aumentar cantidad
    const increaseQuantity = (id) => {
  setCart((prevCart) =>
    prevCart.map((item) => {
      // Solo aumentar si no supera el stock
      if (item.id === id && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    })
  );
};

    // ✅ Disminuir cantidad
    const decreaseQuantity = (id) => {
      setCart((prevCart) =>
        prevCart
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      );
    };

    // ✅ Vaciar carrito
    const clearCart = () => setCart([]);

    // ✅ Verificar si un producto está en el carrito
    const isInCart = (id) => {
      return cart.some(item => item.id === id);
    };

    return (
      <CartContext.Provider
        value={{
          cart,
          cartTotal,
          cartItemsCount,
          addToCart,
          removeFromCart,
          increaseQuantity,
          decreaseQuantity,
          clearCart,
          isInCart
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }