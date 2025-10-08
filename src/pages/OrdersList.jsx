import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { motion, AnimatePresence } from "framer-motion";

function PedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const pedidosRef = collection(db, "pedidos");
    const pedidosQuery = query(pedidosRef, orderBy("fecha", "desc"));

    const unsubscribe = onSnapshot(pedidosQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidos(data);
    });

    return () => unsubscribe();
  }, []);

  const cambiarEstado = async (id) => {
    try {
      const pedidoRef = doc(db, "pedidos", id);
      await updateDoc(pedidoRef, { estado: "listo" });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  // --- 🔸 RESUMEN DIARIO ---
  const hoy = new Date();
  const pedidosHoy = pedidos.filter((p) => {
    const fecha = p.fecha?.toDate?.();
    return (
      p.estado === "listo" &&
      fecha &&
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  });

  const totalIngresos = pedidosHoy.reduce((acc, p) => acc + (p.total || 0), 0);
  const totalArticulos = pedidosHoy.reduce(
    (acc, p) => acc + (Array.isArray(p.carrito) ? p.carrito.reduce((s, item) => s + (item.quantity || 0), 0) : 0),
    0
  );

  const pedidosFiltrados = pedidos.filter((pedido) =>
    filtro === "todos" ? true : pedido.estado === filtro
  );

  return (
    <div className="p-6">
      {/* 🔸 Resumen del día */}
      <div className="bg-amber-100 p-4 rounded-lg shadow-md mb-6 text-center">
        <h2 className="text-lg font-bold text-amber-900 mb-2">Resumen del día</h2>
        <p>
          Pedidos completados: <strong>{pedidosHoy.length}</strong>
        </p>
        <p>
          Artículos vendidos: <strong>{totalArticulos}</strong>
        </p>
        <p>
          Ingresos totales:{" "}
          <strong>${totalIngresos.toLocaleString("es-AR")}</strong>
        </p>
      </div>

      {/* Selector de filtro */}
      <div className="mb-4 text-center">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-4 py-2 rounded bg-amber-100"
        >
          <option value="todos">Todos</option>
          <option value="en proceso">En proceso</option>
          <option value="listo">Listos</option>
        </select>
      </div>

      {/* Lista de pedidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {pedidosFiltrados.map((pedido) => (
            <motion.div
              key={pedido.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              layout
              className="bg-amber-100 rounded-xl shadow-md p-4 flex flex-col justify-between h-full"
            >
              <h2 className="text-lg font-bold mb-2">{pedido.cliente}</h2>
              <h3 className="text-base font-bold mb-2">
                Fecha: {pedido.fecha.toDate().toLocaleString()}
              </h3>

              {Array.isArray(pedido.carrito) && pedido.carrito.length > 0 ? (
                <ul className="mb-3">
                  {pedido.carrito.map((item, index) => (
                    <li key={index} className="text-gray-800 mb-1">
                      🍪 <strong>{item.name}</strong> — {item.quantity} x ${item.price}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No hay productos</p>
              )}

              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-orange-700">
                  Estado: {pedido.estado || "proceso"}
                </p>
                <p className="font-semibold text-right">Total: ${pedido.total}</p>
              </div>

              {pedido.estado !== "listo" && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => cambiarEstado(pedido.id)}
                  className="bg-[#ffa2b5] hover:bg-[#ff95ab] text-white px-4 py-2 rounded transition"
                >
                  Marcar como listo
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PedidosList;
