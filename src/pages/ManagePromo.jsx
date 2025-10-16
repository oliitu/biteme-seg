// src/pages/ManagePromo.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

export default function ManagePromo() {
  const [title, setTitle] = useState("");
  const [motivo, setMotivo] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [promoId, setPromoId] = useState(null);

  useEffect(() => {
    const fetchPromos = async () => {
      const snapshot = await getDocs(collection(db, "promos"));
      if (!snapshot.empty) {
        const data = snapshot.docs[0];
        const promo = data.data();
        setPromoId(data.id);
        setTitle(promo.title || "");
        setMotivo(promo.motivo || "");
        setInicio(promo.inicio ? promo.inicio.substring(0, 16) : "");
        setFin(promo.fin ? promo.fin.substring(0, 16) : "");
        setDescuento(promo.descuento || 0);
      }
    };
    fetchPromos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaPromo = {
      title,
      motivo,
      inicio,
      fin,
      descuento: Number(descuento),
      activo: true,
    };

    try {
      if (promoId) {
        await updateDoc(doc(db, "promos", promoId), nuevaPromo);
        alert("✅ Promoción actualizada");
      } else {
        await addDoc(collection(db, "promos"), nuevaPromo);
        alert("🎉 Promoción creada");
      }
    } catch (err) {
      console.error("Error al guardar promo:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-amber-50 rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-yellow-900">Gestionar Promoción</h2>
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
