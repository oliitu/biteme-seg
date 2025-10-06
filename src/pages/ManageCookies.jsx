import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ManageCookies() {
  const [cookies, setCookies] = useState([]);
  const [newCookie, setNewCookie] = useState({ name: "", description: "", price: "", image: "" });
  const [editing, setEditing] = useState(null);

  const cookiesRef = collection(db, "cookies");

  useEffect(() => {
    const fetchCookies = async () => {
      const snapshot = await getDocs(cookiesRef);
      setCookies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCookies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const ref = doc(db, "cookies", editing);
        await updateDoc(ref, newCookie);
      } else {
        await addDoc(cookiesRef, { ...newCookie, price: Number(newCookie.price) });
      }
      setNewCookie({ name: "", description: "", price: "", image: "" });
      setEditing(null);
      const snapshot = await getDocs(cookiesRef);
      setCookies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error al guardar cookie:", error);
    }
  };

  const handleEdit = (cookie) => {
    setNewCookie(cookie);
    setEditing(cookie.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "cookies", id));
    setCookies(cookies.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-amber-900 font-poppins">
        Gestionar Cookies
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Nombre"
          value={newCookie.name}
          onChange={(e) => setNewCookie({ ...newCookie, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newCookie.description}
          onChange={(e) => setNewCookie({ ...newCookie, description: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={newCookie.price}
          onChange={(e) => setNewCookie({ ...newCookie, price: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Nombre de imagen (sin .png)"
          value={newCookie.image}
          onChange={(e) => setNewCookie({ ...newCookie, image: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded w-full"
        >
          {editing ? "Actualizar" : "Agregar"} Cookie
        </button>
      </form>

      <div className="space-y-2">
        {cookies.map((cookie) => (
          <div
            key={cookie.id}
            className="border rounded p-3 flex justify-between items-center bg-amber-50"
          >
            <div>
              <p className="font-bold">{cookie.name}</p>
              <p>${cookie.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(cookie)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cookie.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

