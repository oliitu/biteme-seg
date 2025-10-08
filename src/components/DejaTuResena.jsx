import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";

function FormularioResena({ onClose }) {
  const [name, setName] = useState("");
  const [opinion, setOpinion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [rating, setRating] = useState(0);

  const enviarResena = async (e) => {
    e.preventDefault();
    if (!opinion.trim()) {
      setMensaje("Por favor escribí una opinión.");
      return;
    }

    setEnviando(true);
    try {
      await addDoc(collection(db, "resenas"), {
        name: name.trim() || "Cliente",
        opinion: opinion.trim(),
        rating,
        fecha: Timestamp.now(),
      });

      setMensaje("¡Gracias por tu reseña!");
      setName("");
      setOpinion("");

      // Cierra el modal
      if (onClose) onClose();
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      setMensaje("Hubo un error al enviar la reseña.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={enviarResena}
      className="bg-amber-100 p-4 rounded-xl space-y-4 w-full"
    >
      <h2 className="text-2xl font-bold text-orange-950">🎉 ¡Listo! 🎉</h2>
      <h3 className="text-xl font-bold text-orange-950">Dejá tu reseña porfi</h3>
      <input
        type="text"
        placeholder="Tu nombre (opcional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      <textarea
        placeholder="Tu opinión"
        value={opinion}
        onChange={(e) => setOpinion(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        rows={4}
      />
      <div className="flex justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => setRating(star)}
            xmlns="http://www.w3.org/2000/svg"
            fill={star <= rating ? "#facc15" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer text-yellow-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.248 3.828a1 1 0 00.95.69h4.016c.969 0 1.371 1.24.588 1.81l-3.25 2.36a1 1 0 00-.364 1.118l1.249 3.828c.3.921-.755 1.688-1.538 1.118l-3.25-2.36a1 1 0 00-1.175 0l-3.25 2.36c-.783.57-1.838-.197-1.538-1.118l1.249-3.828a1 1 0 00-.364-1.118l-3.25-2.36c-.783-.57-.38-1.81.588-1.81h4.016a1 1 0 00.95-.69l1.248-3.828z"
            />
          </svg>
        ))}
      </div>
      <button
        type="submit"
        disabled={enviando}
        className={`w-full ${
          enviando ? "bg-gray-400" : "bg-[#ffa2b5] hover:bg-[#ff95ab]"
        } text-white px-4 py-2 rounded transition`}
      >
        {enviando ? "Enviando..." : "Enviar reseña"}
      </button>
      {mensaje && <p className="text-orange-950 text-center">{mensaje}</p>}
    </form>
  );
}

export default FormularioResena;
