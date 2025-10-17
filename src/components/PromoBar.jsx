// src/components/PromoBar.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PromoBar({ promo }) {
  const [tiempoRestante, setTiempoRestante] = useState("");

  useEffect(() => {
    const calcularTiempo = () => {
      if (!promo?.fin) return;

      const fin =
        typeof promo.fin === "string"
          ? new Date(promo.fin)
          : promo.fin.seconds
          ? new Date(promo.fin.seconds * 1000)
          : new Date(promo.fin);

      const ahora = new Date();
      const diff = fin - ahora;

      if (diff <= 0) {
        setTiempoRestante("Finalizada");
        return;
      }

      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diff / (1000 * 60)) % 60);
      const segundos = Math.floor((diff / 1000) % 60);

      // Mostrar siempre días, horas, minutos y segundos
      const texto = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
      setTiempoRestante(texto);
    };

    calcularTiempo();
    const timer = setInterval(calcularTiempo, 1000); // actualizar cada segundo

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
        : `¡${promo.specialPrice ? `A $${promo.specialPrice}` : "Descuento especial"}!`}{" "}
      ⏰ {tiempoRestante}
    </motion.div>
  );
}
