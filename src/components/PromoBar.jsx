import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PromoBar({ promo }) {
  const [tiempoRestante, setTiempoRestante] = useState("");

  useEffect(() => {
    const calcularTiempo = () => {
      const finRaw = promo.fin || promo.promoEnd;
      if (!finRaw) return;

      const fin =
        typeof finRaw === "string"
          ? new Date(finRaw)
          : finRaw.seconds
          ? new Date(finRaw.seconds * 1000)
          : new Date(finRaw);

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

      setTiempoRestante(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
    };

    calcularTiempo();
    const timer = setInterval(calcularTiempo, 1000);
    return () => clearInterval(timer);
  }, [promo.fin, promo.promoEnd]);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-[#ff538d] to-[#ffdc95] text-white text-center py-2 font-semibold text-xs md:text-base shadow-md"
    >
      🎉 {promo.title || promo.name} —{" "}
      {promo.motivo
        ? `${promo.motivo} (${promo.descuento || ""}% OFF)`
        : `¡${promo.specialPrice ? `A $${promo.specialPrice}` : "Descuento especial"}!`}{" "}
      <p className=" sm:ml-4 inline-block">⏰ {tiempoRestante}</p>
    </motion.div>
  );
}
