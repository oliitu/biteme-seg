// src/pages/ManagePromo.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

export default function ManagePromo() {
  const [title, setTitle] = useState("");
  const [motivo, setMotivo] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const docRef = doc(db, "promos", "global");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const promo = docSnap.data();
          setTitle(promo.title || "");
          setMotivo(promo.motivo || "");
          setDescuento(promo.descuento || 0);

          // Convertir timestamps a formato datetime-local (YYYY-MM-DDTHH:mm)
          if (promo.inicio?.seconds && promo.fin?.seconds) {
            const inicioDate = new Date(promo.inicio.seconds * 1000);
            const finDate = new Date(promo.fin.seconds * 1000);

            setInicio(inicioDate.toISOString().slice(0, 16));
            setFin(finDate.toISOString().slice(0, 16));
          }
        }
      } catch (error) {
        console.error("Error al obtener promoción global:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convertir los valores de fecha del input a Timestamp
      const inicioTimestamp = Timestamp.fromDate(new Date(inicio));
      const finTimestamp = Timestamp.fromDate(new Date(fin));

      const promoData = {
        title,
        motivo,
        inicio: inicioTimestamp,
        fin: finTimestamp,
        descuento: Number(descuento),
        activo: true,
      };

      await setDoc(doc(db, "promos", "global"), promoData);
      alert("✅ Promoción global guardada correctamente");
    } catch (error) {
      console.error("Error al guardar promoción global:", error);
      alert("❌ Error al guardar la promoción");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-amber-50 rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-yellow-900">Gestionar Promoción Global</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Título de la promo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg p-2"
            required
          />

          <textarea
            placeholder="Motivo o descripción"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="border rounded-lg p-2"
            rows="3"
            required
          />

          <div className="flex gap-4">
            <div className="flex flex-col w-1/2">
              <label className="text-sm text-gray-600">Inicio</label>
              <input
                type="datetime-local"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className="border rounded-lg p-2"
                required
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-sm text-gray-600">Fin</label>
              <input
                type="datetime-local"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                className="border rounded-lg p-2"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Descuento (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className="border rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-800 text-white rounded-lg py-2 hover:bg-yellow-900 transition"
          >
            Guardar promoción
          </button>
        </form>
      </div>
    </div>
  );
}
