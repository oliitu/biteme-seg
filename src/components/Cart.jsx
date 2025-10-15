import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartContext";
// import { doc, updateDoc, getDoc } from "firebase/firestore"; // No usados en este componente
// import { db } from "../firebase/config"; // No usados en este componente

export default function Cart({
  setMostrarModal,
  isStickyCart = false,
}) {
  const {
    cart,
    cartTotal, // Este es ahora el total final con descuento
    cartSubtotal, // Nuevo: Total sin descuento
    discountApplied, // Nuevo: Booleano si el descuento está activo
    currentDiscountCode, // Nuevo: Código actualmente aplicado
    applyDiscount, // Nuevo: Función para aplicar el descuento
    removeDiscount, // Nuevo: Función para quitar el descuento
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useContext(CartContext); // 🚨 Asegúrate de que tu CartContext exporte los 5 nuevos valores/funciones

  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const carritoRef = useRef(null);

  // Estados locales para la interfaz del descuento
  const [inputCode, setInputCode] = useState(currentDiscountCode || "");
  const [message, setMessage] = useState("");

  const isEmpty = !cart || cart.length === 0;

  // Cerrar el carrito si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (carritoRef.current && !carritoRef.current.contains(event.target)) {
        setMostrarCarrito(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sincroniza el código del contexto con el input local si se actualiza
  useEffect(() => {
      setInputCode(currentDiscountCode);
  }, [currentDiscountCode]);

  // Manejadores de descuento
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

  // El monto del descuento (25% del subtotal)
  const discountAmount = discountApplied ? cartSubtotal * 0.25 : 0;
  
  // Renderizado
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
      {/* Icono carrito */}
      <div
        className="relative bg-yellow-900 p-2 sm:p-4 rounded-full cursor-pointer"
        onClick={() =>
          window.innerWidth < 640 && setMostrarCarrito((prev) => !prev)
        }
      >
        <img
          src="/img/carrito.png"
          alt="imagen carrito"
          className="w-6 md:w-9 lg:w-15 drop-shadow-4xl object-contain"
        />

        {/* Badge animado */}
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

      {/* Contenido del carrito */}
      {mostrarCarrito && (
        <div
          id="carrito"
           className="mt-0 absolute right-0 bg-[#fff8de] rounded shadow p-4 z-10 sm:w-auto overflow-y-auto max-h-[60vh] min-w-[200px]"
        >
          {isEmpty ? (
            <p className="text-center">El carrito está vacío</p>
          ) : (
            <>
              {/* === TABLA DESKTOP === */}
              <div className="w-full overflow-y-autotable-auto hidden sm:table">
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
                    {cart.map((cookie) => (
                      <tr key={cookie.id} className="border-b border-yellow-900">
                        <td className="p-2">
                          <img
                            src={cookie.imageUrl}
                            alt={cookie.name}
                            className="w-10 mx-auto h-10 object-cover rounded"
                          />
                        </td>
                        <td className="p-2 text-orange-950">{cookie.name}</td>
                        <td className="p-2 text-orange-950">${cookie.price}</td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => decreaseQuantity(cookie.id)}
                              className="cursor-pointer px-2 hover:text-lg hover:bg-[#de8a9b] bg-[#fcb9c6] rounded"
                            >
                              −
                            </motion.button>
                            <span>{cookie.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => increaseQuantity(cookie.id)}
                              className="cursor-pointer px-2 hover:text-lg hover:bg-[#de8a9b] bg-[#fcb9c6] rounded"
                            >
                              +
                            </motion.button>
                          </div>
                        </td>
                        <td className="p-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeFromCart(cookie.id)}
                            className="text-red-600 cursor-pointer text-center hover:text-lg"
                          >
                            X
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Descuento y Totales - DESKTOP */}
                <div className="mt-4 p-2 border-t border-yellow-900">
                    {/* Campo de Descuento */}
                    <div className="mb-3">
                        <label className="text-sm font-poppins text-orange-950 block mb-1">
                            Código de Descuento:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder=""
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                disabled={discountApplied}
                                className="flex-grow p-1 border border-yellow-900 rounded bg-amber-50 disabled:bg-[#fcb9c6] text-orange-950 text-sm"
                            />
                            {!discountApplied ? (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleApplyDiscount}
                                    className="px-3 py-1 bg-[#fcb9c6] text-orange-950 font-semibold rounded hover:bg-[#de8a9b] text-sm"
                                >
                                    Aplicar
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRemoveDiscount}
                                    className="px-3 py-1 bg-red-400 text-white font-semibold rounded hover:bg-red-500 text-sm"
                                >
                                    Quitar
                                </motion.button>
                            )}
                        </div>
                        {message && (
                            <p className={`mt-1 text-xs font-semibold ${discountApplied ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                    
                    {/* Resumen de Pago */}
                    <div className="border-t border-yellow-900 pt-2 space-y-1">
                        <div className="flex justify-between font-semibold text-orange-950">
                            <span>Subtotal:</span>
                            <span>${cartSubtotal.toFixed(2)}</span>
                        </div>
                        {discountApplied && (
                            <div className="flex justify-between font-semibold text-green-700">
                                <span>Descuento (25%):</span>
                                <span>-${discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg text-yellow-900 border-t border-yellow-900 pt-1">
                            <span>Total a pagar:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={clearCart}
                    className="font-poppins bg-[#fcb9c6] hover:bg-[#de8a9b] px-3 py-2 rounded-lg text-sm"
                  >
                    Vaciar Carrito
                  </motion.button>
                  <motion.button
                    onClick={() => setMostrarModal(true)}
                    whileTap={{ scale: 0.95 }}
                    className="btn mt-0 p-2 bg-yellow-900 text-white rounded hover:bg-yellow-950"
                  >
                    Pagar
                  </motion.button>
                </div>
              </div>

              {/* === VISTA MÓVIL === */}
              <div className="flex flex-col gap-4 sm:hidden">
                {cart.map((cookie) => (
                  <div key={cookie.id} className="flex gap-3 border-b pb-3 border-yellow-900 items-center">
                    <img
                      src={cookie.imageUrl}
                      alt={cookie.name}
                      className="w-16 h-16 drop-shadow-md object-cover rounded"
                    />
                    <div className="text-orange-950 flex-grow">
                      <h4 className="font-semibold">{cookie.name}</h4>
                      <p>${cookie.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => decreaseQuantity(cookie.id)}
                          className="px-2 bg-[#fcb9c6] rounded"
                        >
                          −
                        </motion.button>
                        <span>{cookie.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => increaseQuantity(cookie.id)}
                          className="px-2 bg-[#fcb9c6] rounded"
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeFromCart(cookie.id)}
                      className="text-red-600 text-2xl ml-2 self-center"
                    >
                      X
                    </motion.button>
                  </div>
                ))}
                
                {/* Descuento y Totales - MÓVIL */}
                <div className="border-t border-yellow-900 pt-3">
                    {/* Campo de Descuento */}
                    <div className="mb-3">
                        <label className="text-sm font-poppins text-orange-950 block mb-1">
                            Código de Descuento:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="EXPODESCUENTOS"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                disabled={discountApplied}
                                className="flex-grow p-1 border border-yellow-900 rounded bg-[#fff8de] disabled:bg-[#fcb9c6] text-orange-950 text-sm"
                            />
                            {!discountApplied ? (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleApplyDiscount}
                                    className="px-3 py-1 bg-[#fcb9c6] text-orange-950 font-semibold rounded hover:bg-[#de8a9b] text-sm"
                                >
                                    Aplicar
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRemoveDiscount}
                                    className="px-3 py-1 bg-red-400 text-white font-semibold rounded hover:bg-red-500 text-sm"
                                >
                                    Quitar
                                </motion.button>
                            )}
                        </div>
                        {message && (
                            <p className={`mt-1 text-xs font-semibold ${discountApplied ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                    
                    {/* Resumen de Pago */}
                    <div className="border-t border-yellow-900 pt-2 space-y-1">
                        <div className="flex justify-between font-semibold text-orange-950">
                            <span>Subtotal:</span>
                            <span>${cartSubtotal.toFixed(2)}</span>
                        </div>
                        {discountApplied && (
                            <div className="flex justify-between font-semibold text-green-700">
                                <span>Descuento (25%):</span>
                                <span>-${discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg text-yellow-900 border-t border-yellow-900 pt-1">
                            <span>Total a pagar:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="justify-items-start mt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={clearCart}
                    className="font-poppins mt-2 bg-[#fcb9c6] hover:bg-[#de8a9b] px-3 py-2 mb-4 rounded-lg text-sm"
                  >
                    Vaciar Carrito
                  </motion.button>

                  <div className="flex items-center justify-center">
                    <motion.button
                      onClick={() => setMostrarModal(true)}
                      className="text-white bg-[#6e3712] font-poppins min-w-50 hover:bg-yellow-950 mt-2 rounded-sm text-base px-5 py-2.5 text-center"
                    >
                      Pagar
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}