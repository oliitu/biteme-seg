import { motion, AnimatePresence } from 'framer-motion';
import { useResumenesDiarios } from '../hooks/Resumenes';


// 🚨 ELIMINAR { db } de las props
export default function ResumenesList() { 
  const { resumenes, loading, error } = useResumenesDiarios();

  if (loading) return <p>Cargando resúmenes diarios...</p>;
  if (error) return <p>Error al cargar: {error.message}</p>;
  if (resumenes.length === 0) return <p>No hay resúmenes diarios para mostrar.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <AnimatePresence>
        {resumenes.map((resumen) => (
          <motion.div
            key={resumen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            layout
            className="bg-amber-100 rounded-xl shadow-lg p-6 flex flex-col h-full hover:shadow-xl transition-shadow"
          >
            {/* Título y Fecha */}
            <h2 className="text-xl font-extrabold text-amber-900 mb-3 border-b pb-2">
              Resumen del Día
            </h2>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              🗓️ Fecha: {resumen.fecha.toDate().toLocaleDateString()}
            </h3>

            {/* Estadísticas Clave */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <p className="font-medium text-gray-800">
                  Total Pedidos: <span className="font-bold text-[#ff84ad]">{resumen.totalPedidos}</span>
                </p>
                <p className="font-medium text-gray-800 text-right">
                  Total Artículos: <span className="font-bold text-[#ff84ad]">{resumen.totalArticulos}</span>
                </p>
            </div>

            {/* Ingresos Totales */}
            <div className="mb-4 bg-[#ff84ad] p-3 rounded-lg">
                <p className="text-xl font-bold text-yellow-950 text-center">
                  💰 Ingresos Totales: ${resumen.totalIngresos.toFixed(2)}
                </p>
            </div>


            {/* Listado de Artículos (cookiesVendidas) */}
            <h4 className="text-base font-bold text-yellow-950 mb-2 mt-3 border-t pt-2">
                Artículos Vendidos:
            </h4>
            {Array.isArray(resumen.cookiesVendidas) && resumen.cookiesVendidas.length > 0 ? (
                <ul className="mb-3 space-y-1 text-sm overflow-auto max-h-40">
                    {/* El objeto 'cookiesVendidas' parece contener { name, quantity } */}
                    {resumen.cookiesVendidas.map((item, index) => (
                        <li key={index} className="text-gray-700 bg-amber-50 p-2 rounded-md shadow-sm">
                            🍪 <strong className="text-[#ff84ad]">{item.name}</strong> — <span className="font-bold">{item.quantity}</span> unidades vendidas
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 italic">No hay detalle de artículos vendidos.</p>
            )}

          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}