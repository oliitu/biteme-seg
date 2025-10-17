import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartContext";

export default function Cart({ setMostrarModal, isStickyCart = false }) {
  const {
    cart,
    cartTotal,
    cartSubtotal,
    discountApplied,
    discountAmount,
    currentDiscountCode,
    applyDiscount,
    removeDiscount,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    globalPromo // <-- necesitamos el promo global aquí
  } = useContext(CartContext);

  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const carritoRef = useRef(null);

  const [inputCode, setInputCode] = useState(currentDiscountCode || "");
  const [message, setMessage] = useState("");

  const isEmpty = !cart || cart.length === 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (carritoRef.current && !carritoRef.current.contains(event.target)) {
        setMostrarCarrito(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setInputCode(currentDiscountCode || "");
  }, [currentDiscountCode]);

  const handleApplyDiscount = () => {
    if (!inputCode.trim()) {
      setMessage("Introduce el código de descuento.");
      return;
    }
    const result = applyDiscount(inputCode.trim());
    setMessage(result.message);
  };

  const handleRemoveDiscount = () => {
    const result = removeDiscount();
    setMessage(result.message);
    setInputCode("");
  };

  // Helper para calcular precio item (prioridad: promo individual > priceFinal guardado > globalPromo > price)
  const computeItemDisplay = (cookie) => {
    const now = new Date();

    // si el carrito ya tiene priceFinal (guardado al agregar), preferirlo
    if (typeof cookie.priceFinal === "number") {
      // priceFinal ya debería incluir la aplicación del global (si se guardó así)
      return {
        price: cookie.priceFinal,
        label: null,
        original: cookie.price
      };
    }

    // promo individual activa?
    const promoStart = cookie.promoStart ? (cookie.promoStart.seconds ? new Date(cookie.promoStart.seconds * 1000) : new Date(cookie.promoStart)) : null;
    const promoEnd = cookie.promoEnd ? (cookie.promoEnd.seconds ? new Date(cookie.promoEnd.seconds * 1000) : new Date(cookie.promoEnd)) : null;
    const individualActive = cookie.specialPrice && promoStart && promoEnd && now >= promoStart && now <= promoEnd;

    if (individualActive) {
      return {
        price: Number(cookie.specialPrice),
        original: cookie.price
      };
    }

    // global promo (desde context) válida?
    if (globalPromo && globalPromo.activo) {
      // globalPromo.inicio/fin pueden ser Timestamps o strings; convertimos defensivamente
      const gStart = globalPromo.inicio ? (globalPromo.inicio.seconds ? new Date(globalPromo.inicio.seconds * 1000) : new Date(globalPromo.inicio)) : null;
      const gEnd = globalPromo.fin ? (globalPromo.fin.seconds ? new Date(globalPromo.fin.seconds * 1000) : new Date(globalPromo.fin)) : null;
      if (gStart && gEnd && now >= gStart && now <= gEnd) {
        const discounted = Number((cookie.price * (1 - (Number(globalPromo.descuento) / 100))).toFixed(2));
        return {
          price: discounted,
          label: `-${globalPromo.descuento}% OFF`,
          original: cookie.price
        };
      }
    }

    // default
    return {
      price: Number(cookie.price),
      label: null,
      original: cookie.price
    };
  };

  return (
    <div
      ref={carritoRef}
      className={`carrito z-50 ${
        isStickyCart
          ? "fixed top-6 sm:top-16 right-4 sm:right-10"
          : "absolute top-16 sm:top-46 right-4 sm:right-10"
      }`}
      onMouseEnter={() => window.innerWidth >= 640 && setMostrarCarrito(true)}
      onMouseLeave={() => window.innerWidth >= 640 && setMostrarCarrito(false)}
    >
      <div
        className="relative bg-yellow-900 p-2 sm:p-4 rounded-full cursor-pointer"
        onClick={() =>
          window.innerWidth < 640 && setMostrarCarrito((prev) => !prev)
        }
      >
        <img src="/img/carrito.png" alt="imagen carrito" className="w-6 md:w-9 lg:w-15 drop-shadow-4xl object-contain" />
        <AnimatePresence mode="popLayout">
          {cart?.length > 0 && (
            <motion.span
              key={cart.reduce((total, item) => total + item.quantity, 0)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1 -left-1 bg-[#ff2ba3] text-white sm:text-base text-xs font-bold rounded-full w-4 sm:w-7 h-4 sm:h-7 flex items-center justify-center"
            >
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {mostrarCarrito && (
        <div id="carrito" className="mt-0 absolute right-0 bg-[#fff8de] rounded shadow p-4 z-10 sm:w-auto overflow-y-auto max-h-[60vh] min-w-[200px]">
          {isEmpty ? (
            <p className="text-center">El carrito está vacío</p>
          ) : (
            <>
              {/* TABLE DESKTOP */}
              <div className="w-full overflow-y-auto hidden sm:table">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#fcb9c6] text-left">
                      <th className="p-2 font-poppins text-orange-950 text-center">Imagen</th>
                      <th className="p-2 font-poppins text-orange-950 text-center">Nombre</th>
                      <th className="p-2 font-poppins text-orange-950 text-center">Precio</th>
                      <th className="p-2 font-poppins text-orange-950">Cantidad</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-900">
                    {cart.map((cookie) => {
                      const { price, label, original } = computeItemDisplay(cookie);

                      return (
                        <tr key={cookie.id} className="border-b border-yellow-900">
                          <td className="p-2">
                            <img src={cookie.imageUrl} alt={cookie.name} className="w-10 mx-auto h-10 object-cover rounded" />
                          </td>
                          <td className="p-2 text-orange-950">{cookie.name}</td>
                          <td className="p-2 text-orange-950 text-center">
                            {label && <p className="text-xs text-green-700">{label}</p>}
                            <p>
                              ${Number(price).toFixed(2)}
                              {label && (
                                <span className="line-through text-xs text-gray-500 ml-1">
                                  ${Number(original).toFixed(2)}
                                </span>
                              )}
                            </p>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <motion.button whileTap={{ scale: 0.95 }} onClick={() => decreaseQuantity(cookie.id)} className="cursor-pointer px-2 hover:text-lg hover:bg-[#de8a9b] bg-[#fcb9c6] rounded">−</motion.button>
                              <span>{cookie.quantity}</span>
                              <motion.button whileTap={{ scale: 0.95 }} onClick={() => increaseQuantity(cookie.id)} className="cursor-pointer px-2 hover:text-lg hover:bg-[#de8a9b] bg-[#fcb9c6] rounded">+</motion.button>
                            </div>
                          </td>
                          <td className="p-2">
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => removeFromCart(cookie.id)} className="text-red-600 cursor-pointer text-center hover:text-lg">X</motion.button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Totals & discount */}
                <div className="mt-4 p-2 border-t border-yellow-900">
                  <div className="mb-3">
                    <label className="text-sm font-poppins text-orange-950 block mb-1">Código de Descuento:</label>
                    <div className="flex space-x-2">
                      <input type="text" placeholder="" value={inputCode} onChange={(e) => setInputCode(e.target.value)} disabled={discountApplied} className="flex-grow p-1 border border-yellow-900 rounded bg-amber-50 disabled:bg-[#fcb9c6] text-orange-950 text-sm" />
                      {!discountApplied ? (
                        <motion.button whileTap={{ scale: 0.95 }} onClick={handleApplyDiscount} className="px-3 py-1 bg-[#fcb9c6] text-orange-950 font-semibold rounded hover:bg-[#de8a9b] text-sm">Aplicar</motion.button>
                      ) : (
                        <motion.button whileTap={{ scale: 0.95 }} onClick={handleRemoveDiscount} className="px-3 py-1 bg-red-400 text-white font-semibold rounded hover:bg-red-500 text-sm">Quitar</motion.button>
                      )}
                    </div>
                    {message && <p className={`mt-1 text-xs font-semibold ${discountApplied ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                  </div>

                  <div className="border-t border-yellow-900 pt-2 space-y-1">
                    <div className="flex justify-between font-semibold text-orange-950">
                      <span>Subtotal:</span>
                      <span>${Number(cartSubtotal || 0).toFixed(2)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between font-semibold text-green-700">
                        <span>Descuento (25%):</span>
                        <span>-${Number(discountAmount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-yellow-900 border-t border-yellow-900 pt-1">
                      <span>Total a pagar:</span>
                      <span>${Number(cartTotal || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={clearCart} className="font-poppins bg-[#fcb9c6] hover:bg-[#de8a9b] px-3 py-2 rounded-lg text-sm">Vaciar Carrito</motion.button>
                  <motion.button onClick={() => setMostrarModal(true)} whileTap={{ scale: 0.95 }} className="btn mt-0 p-2 bg-yellow-900 text-white rounded hover:bg-yellow-950">Pagar</motion.button>
                </div>
              </div>

              {/* MOBILE */}
              <div className="flex flex-col gap-4 sm:hidden">
                {cart.map((cookie) => {
                  const { price, label, original } = computeItemDisplay(cookie);
                  return (
                    <div key={cookie.id} className="flex gap-3 border-b pb-3 border-yellow-900 items-center">
                      <img src={cookie.imageUrl} alt={cookie.name} className="w-16 h-16 drop-shadow-md object-cover rounded" />
                      <div className="text-orange-950 flex-grow">
                        <h4 className="font-semibold">{cookie.name}</h4>
                        <p>
                          ${Number(price).toFixed(2)}
                          {label && (
                            <>
                              <span className="line-through text-xs text-gray-500 ml-1">${Number(original).toFixed(2)}</span>
                              <span className="text-xs text-green-700 ml-1">{label}</span>
                            </>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => decreaseQuantity(cookie.id)} className="px-2 bg-[#fcb9c6] rounded">−</motion.button>
                          <span>{cookie.quantity}</span>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => increaseQuantity(cookie.id)} className="px-2 bg-[#fcb9c6] rounded">+</motion.button>
                        </div>
                      </div>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => removeFromCart(cookie.id)} className="text-red-600 text-2xl ml-2 self-center">X</motion.button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
