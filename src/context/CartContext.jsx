import { createContext, useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config"; // Ajustá la ruta según tu proyecto


// Definición de las constantes del descuento
const DISCOUNT_CODE = "EXPODESCUENTOS";
const DISCOUNT_RATE = 0.2; // 25%

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [currentDiscountCode, setCurrentDiscountCode] = useState('');
    const [globalPromo, setGlobalPromo] = useState(null);

// Cargar promo global desde Firestore
useEffect(() => {
  const fetchGlobalPromo = async () => {
    try {
      const snapshot = await getDocs(collection(db, "promos"));
      const now = new Date();
      const activePromo = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .find(p => p.id === "global" && p.activo && new Date(p.inicio.seconds * 1000) <= now && new Date(p.fin.seconds * 1000) >= now);
      if (activePromo) setGlobalPromo(activePromo);
    } catch (err) {
      console.error("Error fetching global promo:", err);
    }
  };
  fetchGlobalPromo();
}, []);
    // === GESTIÓN DE LOCAL STORAGE ===

    // 1. Cargar carrito, descuento y código al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        const savedDiscount = localStorage.getItem("discountApplied");
        const savedCode = localStorage.getItem("currentDiscountCode");

        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error("Error loading cart from localStorage:", error);
                setCart([]);
            }
        }
        if (savedDiscount) {
            setDiscountApplied(JSON.parse(savedDiscount));
        }
        if (savedCode) {
            setCurrentDiscountCode(savedCode);
        }
    }, []);

    // 2. Guardar carrito, descuento y código cada vez que cambian
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("discountApplied", JSON.stringify(discountApplied));
        localStorage.setItem("currentDiscountCode", currentDiscountCode);
    }, [cart, discountApplied, currentDiscountCode]);

    // === CÁLCULOS DE TOTALES ===

    // Calcular Subtotal (total sin descuento)
    const cartSubtotal = useMemo(() => {
  return cart.reduce((acc, item) => acc + item.priceFinal * item.quantity, 0);
}, [cart]);

const finalTotal = useMemo(() => {
  if (discountApplied) {
    return cartSubtotal * (1 - DISCOUNT_RATE); // aplica código de descuento
  }
  return cartSubtotal;
}, [cartSubtotal, discountApplied]);
const discountAmount = useMemo(() => {
  return discountApplied ? cartSubtotal * DISCOUNT_RATE : 0;
}, [cartSubtotal, discountApplied]);


    // === FUNCIONES DE DESCUENTO ===

    const applyDiscount = (code) => {
        if (code.toUpperCase() === DISCOUNT_CODE) {
            setDiscountApplied(true);
            setCurrentDiscountCode(code.toUpperCase());
            return { success: true, message: `¡Código ${DISCOUNT_CODE} aplicado! 25% de descuento. 🎉` };
        } else {
            setDiscountApplied(false);
            return { success: false, message: "Código de descuento inválido o expirado. 😕" };
        }
    };

    const removeDiscount = () => {
        setDiscountApplied(false);
        setCurrentDiscountCode('');
        return { message: "Descuento eliminado." };
    };

    // === FUNCIONES DEL CARRITO (MANTENIDAS) ===

    // ✅ Calcular cantidad total de items
    const cartItemsCount = cart.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    // ✅ Agregar producto (lógica de stock incluida)
   const addToCart = (product) => {
  const now = new Date();

  // Promo individual activa
  const individualPromoActive =
    product.specialPrice &&
    product.promoStart &&
    product.promoEnd &&
    now >= (product.promoStart.seconds
      ? new Date(product.promoStart.seconds * 1000)
      : new Date(product.promoStart)) &&
    now <= (product.promoEnd.seconds
      ? new Date(product.promoEnd.seconds * 1000)
      : new Date(product.promoEnd));

  // Precio base según promo individual o normal
  let priceFinal = individualPromoActive
    ? product.specialPrice
    : product.price;

  // ✅ Solo aplicar globalPromo si NO hay promo individual
  if (!individualPromoActive && globalPromo && globalPromo.activo) {
    const gStart = globalPromo.inicio
      ? (globalPromo.inicio.seconds
          ? new Date(globalPromo.inicio.seconds * 1000)
          : new Date(globalPromo.inicio))
      : null;
    const gEnd = globalPromo.fin
      ? (globalPromo.fin.seconds
          ? new Date(globalPromo.fin.seconds * 1000)
          : new Date(globalPromo.fin))
      : null;

    if (gStart && gEnd && now >= gStart && now <= gEnd) {
      priceFinal = priceFinal * (1 - globalPromo.descuento / 100);
    }
  }

  setCart((prevCart) => {
    const existing = prevCart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, priceFinal }
            : item
        );
      } else {
        return prevCart;
      }
    }
    if (product.stock > 0) {
      return [...prevCart, { ...product, quantity: 1, priceFinal }];
    }
    return prevCart;
  });
};



    // ✅ Eliminar producto
    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    // ✅ Aumentar cantidad (lógica de stock incluida)
    const increaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
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
    const clearCart = () => {
        setCart([]);
        removeDiscount(); // También eliminamos el descuento al vaciar
    }

    // ✅ Verificar si un producto está en el carrito
    const isInCart = (id) => {
        return cart.some(item => item.id === id);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                cartSubtotal,         // Nuevo: Total sin descuento
                cartTotal: finalTotal, // Renombrado a finalTotal para claridad
                discountApplied,      // Nuevo: Estado del descuento
                discountAmount,       // Nuevo: Monto del descuento
                currentDiscountCode,  // Nuevo: Código aplicado
                applyDiscount,        // Nuevo: Función para aplicar
                removeDiscount,       // Nuevo: Función para quitar
                cartItemsCount,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                isInCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

import { useContext } from "react"; 

export const useCart = () => {
    return useContext(CartContext);
};