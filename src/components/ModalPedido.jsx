import { motion } from "framer-motion";

export default function ModalPedido({
  mostrarModal,
  setMostrarModal,
  cartTotal,
  clienteNombre,
  setClienteNombre,
  metodoPago,
  setMetodoPago,
  confirmarPedido,
  confirmando,
}) {
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-yellow-950/35 flex items-center justify-center">
      <div className="bg-amber-100 rounded-xl pt-12 px-6 pb-6 w-11/12 max-w-md text-center shadow-lg relative">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMostrarModal(false)}
          className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
        >
          X
        </motion.button>

        <h2 className="text-2xl font-bold text-orange-950 mb-4">
          Total a pagar: <span className="text-[#6e3712]">${cartTotal}</span>
        </h2>

        <input
          type="text"
          placeholder="Tu nombre"
          value={clienteNombre}
          onChange={(e) => setClienteNombre(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              confirmarPedido();
            }
          }}
          className="border border-gray-300 rounded px-3 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ff95ab]"
        />

        <div className="mb-4">
          <p className="text-orange-950 text-lg mb-1">Elegí tu forma de pago:</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setMetodoPago("mercado_pago")}
              className={`px-4 py-2 rounded-lg border-2 ${
                metodoPago === "mercado_pago"
                  ? "bg-[#ff95ab] text-white border-[#ff95ab]"
                  : "bg-white text-orange-950 border-[#deca98]"
              }`}
            >
              Mercado Pago
            </button>
            <button
              onClick={() => setMetodoPago("efectivo")}
              className={`px-4 py-2 rounded-lg border-2 ${
                metodoPago === "efectivo"
                  ? "bg-[#ff95ab] text-white border-[#ff95ab]"
                  : "bg-white text-orange-950 border-[#deca98]"
              }`}
            >
              Efectivo
            </button>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: confirmando ? 1 : 0.95 }}
          onClick={confirmarPedido}
          disabled={confirmando}
          className={`${
            confirmando
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#ffa1b4] hover:bg-[#ff8aa4]"
          } text-white px-4 py-2 rounded transition w-full mt-2`}
        >
          {confirmando ? "Confirmando..." : "Confirmar pedido"}
        </motion.button>
      </div>
    </div>
  );
}
