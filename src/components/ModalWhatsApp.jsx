import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";
export default function ModalWhatsApp({
  linkWhatsApp,
  setMostrarBotonWhatsApp,
  setMostrarModalResena,
  setToast
}) {
  const [aliasCopiado, setAliasCopiado] = useState(false);

  const handleWhatsAppClick = () => {
    if (!linkWhatsApp) {
      setToast("Error: enlace de WhatsApp inválido");
      return;
    }

    window.open(linkWhatsApp, "_blank");
    setMostrarBotonWhatsApp(false);
    setMostrarModalResena(true);
    setToast("Pedido confirmado 🎉");
  };

  const handleAliasClick = () => {
    navigator.clipboard.writeText("biteme.vcp");

    if (window.innerWidth < 768) {
      // Pantallas chicas → mostrar emoji ✅ con animación
      setAliasCopiado(true);
      setTimeout(() => setAliasCopiado(false), 2000); 
    } else {
      // Pantallas grandes → usar toast
      setToast("Alias copiado 📋");
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-yellow-950/35 flex items-center justify-center">
      <div className="bg-amber-100 rounded-xl pt-12 px-6 pb-5 sm:pb-6 w-11/12 max-w-md text-center shadow-lg relative">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMostrarBotonWhatsApp(false)}
          className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
          aria-label="Cerrar modal"
        >
          X
        </motion.button>

        <h2 className="text-3xl font-bold text-orange-950 mb-1 lg:mb-2">¡Ya casi!</h2> 

        <div className="bg-[#fff8de] border-2 border-yellow-900 rounded-lg px-4 py-3 my-4 shadow-sm text-left">
          <p className="text-orange-950 text-lg mb-1">Transferí al siguiente alias:</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAliasClick}
              className="text-2xl font-bold text-yellow-900 tracking-wide hover:underline focus:outline-none"
              title="Copiar alias"
            >
              biteme.vcp
            </button>
            <AnimatePresence>
              {aliasCopiado && (
                <motion.spdivan
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.1 }}
                  
                >
                  <Check color="#ff7399" strokeWidth={3}/>
                </motion.spdivan>
              )}
            </AnimatePresence>
          </div>
          <p className="text-sm text-orange-950">(tocá y copiá el alias)</p>

          <p className="text-orange-950 text-base mt-2">
            Titular: <span className="font-semibold">Olivia Iturrusgarai Ballés</span>
          </p>
        </div>

        <p className="text-base text-orange-950 mb-1 lg:mb-2">
          y envianos el comprobante por whatsapp!
        </p>

        <div className="flex items-center mt-2 justify-center">
          <button
            onClick={handleWhatsAppClick}
            className="focus:outline-none"
            aria-label="Enviar pedido por WhatsApp"
          >
            <img className="h-12 sm:h-14" src="/img/whatsapp.png" alt="WhatsApp" />
          </button>
        </div>
      </div>
    </div>
  );
}
