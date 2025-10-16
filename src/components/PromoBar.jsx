// src/components/PromoBar.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PromoBar({ promo }) {
  const [tiempoRestante, setTiempoRestante] = useState("");

  useEffect(() => {
    const calcularTiempo = () => {
      if (!promo.fin) return;
      const ahora = new Date();
      const fin = new Date(promo.fin);
      const diff = fin - ahora;
      if (diff <= 0) {
        setTiempoRestante("Finalizada");
        return;
      }
      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff / (1000 * 60)) % 60);
      setTiempoRestante(`${horas}h ${minutos}m`);
    };

    calcularTiempo();
    const timer = setInterval(calcularTiempo, 60000); // actualiza cada minuto
    return () => clearInterval(timer);
  }, [promo.fin]);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-[#ff538d] to-[#ffdc95] text-white text-center py-2 font-semibold text-sm md:text-base shadow-md"
    >
      🎉 {promo.title || promo.name} —{" "}
      {promo.motivo
        ? `${promo.motivo} (${promo.descuento || ""}% OFF)`
        : `¡${promo.specialPrice ? `A $${promo.specialPrice}` : "Descuento especial"} hasta ${tiempoRestante}!`}
    </motion.div>
  );
}
