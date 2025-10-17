import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ProductCard({ product }) {
  const { addToCart, cart } = useContext(CartContext);
  const { name, imageUrl, description, price, specialPrice, isSpecial, promoStart, promoEnd, stock } = product;

  const [promoGlobal, setPromoGlobal] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchPromoGlobal = async () => {
      try {
        const docRef = doc(db, "promos", "global");
        const snap = await getDoc(docRef);
        if (snap.exists()) setPromoGlobal(snap.data());
      } catch (error) {
        console.error("Error al obtener promo global:", error);
      }
    };
    fetchPromoGlobal();
  }, []);

  const now = new Date();

  const start = promoStart ? new Date(promoStart.seconds ? promoStart.seconds * 1000 : promoStart) : null;
  const end = promoEnd ? new Date(promoEnd.seconds ? promoEnd.seconds * 1000 : promoEnd) : null;
  const isPromoIndividualActiva = isSpecial && start && end && now >= start && now <= end;

  const inicioGlobal = promoGlobal?.inicio ? new Date(promoGlobal.inicio.seconds ? promoGlobal.inicio.seconds * 1000 : promoGlobal.inicio) : null;
  const finGlobal = promoGlobal?.fin ? new Date(promoGlobal.fin.seconds ? promoGlobal.fin.seconds * 1000 : promoGlobal.fin) : null;
  const isPromoGlobalActiva = promoGlobal?.activo && inicioGlobal && finGlobal && now >= inicioGlobal && now <= finGlobal;

  const promoEndDate = isPromoIndividualActiva ? end : isPromoGlobalActiva ? finGlobal : null;
  useEffect(() => {
    if (!promoEndDate) return;
    const timer = setInterval(() => {
      const diff = promoEndDate - new Date();
      if (diff <= 0) {
        setTimeLeft("Finalizada");
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [promoEndDate]);

  let finalPrice = price;

  if (isPromoGlobalActiva && promoGlobal?.descuento) {
    finalPrice = (price * (1 - promoGlobal.descuento / 100)).toFixed(0);
  }

  if (isPromoIndividualActiva) {
    finalPrice = specialPrice;
  }

  const cartItem = cart.find((item) => item.id === product.id);
  const cantidadEnCarrito = cartItem ? cartItem.quantity : 0;
  const isDisabled = stock === 0 || cantidadEnCarrito >= stock;

  return (
    <motion.div
  whileHover={!isDisabled ? { y: -8, scale: 1.02 } : {}}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative"
>
  {/* 🔹 Contenedor principal */}
  <div className="relative bg-radial hover:drop-shadow-xl from-amber-100 from-40% to-[#fff1bf] rounded-xl shadow py-2 md:py-6 md:px-4 lg:py-6 lg:px-4 text-center flex flex-col h-full">
    
    {/* Contenido gris si está agotado */}
    <div className={`  rounded-xl flex flex-col h-full transition duration-300 ${isDisabled ? "grayscale opacity-60" : ""}`}>
      <motion.img
        whileHover={!isDisabled ? { rotate: 40 } : {}}
        transition={{ duration: 0.3 }}
        src={imageUrl}
        alt={name}
        className="drop-shadow-lg rounded-lg h-18 xs:h-24 sm:h-28 md:h-36 lg:h-48 mx-auto object-contain mt-2 lg:mt-0 mb-2 lg:mb-4"
      />

      <h3 className="font-pacifico text-orange-950 text-xl sm:text-2xl lg:text-3xl mb-2">{name}</h3>
      <p className="mb-2 mx-2 text-xs sm:text-base text-orange-950 font-poppins flex-grow">{description}</p>

      {(isPromoGlobalActiva || isPromoIndividualActiva) ? (
        <div className="flex flex-col items-center mb-2">
          <p className="text-xs sm:text-sm line-through text-gray-600">${price}</p>
          <p className="text-base md:text-xl lg:text-xl text-red-600 font-bold">${finalPrice}</p>
        </div>
      ) : (
        <p className="font-poppins text-[#220d06] font-bold text-base md:text-xl lg:text-xl mb-0 md:mb-2 lg:mb-2">${price}</p>
      )}

      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={isDisabled}
        className={`font-poppins bg-amber-900 text-white mb-0.5 px-1.5 py-0.5 lg:px-3 lg:py-2 md:px-3 md:py-2 mt-1.5 md:mt-3 lg:mt-3 rounded-2xl text-xs lg:text-sm md:text-sm w-fit mx-auto
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-950"}`}
        onClick={() => addToCart(product)}
      >
        {stock === 0 ? "Agotado" : "Añadir al carrito"}
      </motion.button>
    </div>

    {/* 🔹 Overlay de sin stock (NO gris) */}
    {stock === 0 && (
  <div className="absolute inset-0 flex justify-center items-start rounded-xl bg-orange-950/40 z-10 pt-2">
    <img
      src="/img/sinstock.png"
      alt="Sin stock"
      className="w-60 sm:w-90 h-auto object-contain opacity-100"
    />
  </div>
)}


  </div>
</motion.div>

  );
}
