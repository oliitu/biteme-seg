import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp, // 👈 import clave
} from "firebase/firestore";
import { db } from "../firebase/config";

export default function ManageCookies() {
  const [cookies, setCookies] = useState([]);
  const [newCookie, setNewCookie] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const cookiesRef = collection(db, "cookies");

  useEffect(() => {
    const fetchCookies = async () => {
      const snapshot = await getDocs(cookiesRef);
      setCookies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCookies();
  }, []);

  // 📸 Subida de imagen
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "biteme-cookies");
    formData.append("cloud_name", "dxpycsyjw");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dxpycsyjw/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setNewCookie({ ...newCookie, imageUrl: data.secure_url });
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  // 🧁 Guardar o actualizar cookie
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convertir fechas a Timestamp si existen
      const promoStartTimestamp = newCookie.promoStart
        ? Timestamp.fromDate(new Date(newCookie.promoStart))
        : null;
      const promoEndTimestamp = newCookie.promoEnd
        ? Timestamp.fromDate(new Date(newCookie.promoEnd))
        : null;

      const dataToSave = {
        ...newCookie,
        price: Number(newCookie.price),
        stock: Number(newCookie.stock),
        specialPrice: newCookie.specialPrice ? Number(newCookie.specialPrice) : null,
        promoStart: promoStartTimestamp,
        promoEnd: promoEndTimestamp,
      };

      if (editing) {
        const ref = doc(db, "cookies", editing);
        await updateDoc(ref, dataToSave);
      } else {
        await addDoc(cookiesRef, dataToSave);
      }

      // Reset
      setNewCookie({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
      });
      setEditing(null);

      // Refrescar lista
      const snapshot = await getDocs(cookiesRef);
      setCookies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error al guardar cookie:", error);
    }
  };

  const handleEdit = (cookie) => {
    // Convertir timestamps de vuelta a datetime-local friendly
    const promoStart = cookie.promoStart?.seconds
      ? new Date(cookie.promoStart.seconds * 1000).toISOString().slice(0, 16)
      : cookie.promoStart || "";
    const promoEnd = cookie.promoEnd?.seconds
      ? new Date(cookie.promoEnd.seconds * 1000).toISOString().slice(0, 16)
      : cookie.promoEnd || "";

    setNewCookie({ ...cookie, promoStart, promoEnd });
    setEditing(cookie.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "cookies", id));
    setCookies(cookies.filter((c) => c.id !== id));
  };

return ( <div className="max-w-2xl mx-auto mt-10 p-6 font-poppins rounded-lg shadow bg-amber-50"> <h2 className="text-2xl font-bold mb-4 text-center text-amber-900 font-poppins">
Gestionar Cookies </h2>

  <form onSubmit={handleSubmit} className="space-y-3 mb-6">
    <input
      type="text"
      placeholder="Nombre"
      value={newCookie.name}
      onChange={(e) => setNewCookie({ ...newCookie, name: e.target.value })}
      className="border p-2 w-full rounded"
      required
    />
    <textarea
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
      type="number"
      placeholder="Stock"
      value={newCookie.stock}
      onChange={(e) => setNewCookie({ ...newCookie, stock: e.target.value })}
      className="border p-2 w-full rounded"
      required
    />
    {/* Precio especial y fechas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={newCookie.isSpecial || false}
      onChange={(e) => setNewCookie({ ...newCookie, isSpecial: e.target.checked })}
    />
    Activar precio especial
  </label>

  <input
    type="number"
    placeholder="Precio especial"
    value={newCookie.specialPrice || ""}
    onChange={(e) => setNewCookie({ ...newCookie, specialPrice: e.target.value })}
    className="border p-2 w-full rounded"
    disabled={!newCookie.isSpecial}
  />
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
  <input
    type="datetime-local"
    value={newCookie.promoStart || ""}
    onChange={(e) => setNewCookie({ ...newCookie, promoStart: e.target.value })}
    className="border p-2 w-full rounded"
    disabled={!newCookie.isSpecial}
  />
  <input
    type="datetime-local"
    value={newCookie.promoEnd || ""}
    onChange={(e) => setNewCookie({ ...newCookie, promoEnd: e.target.value })}
    className="border p-2 w-full rounded"
    disabled={!newCookie.isSpecial}
  />
</div>

    {/* Subida de imagen */}
    <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 w-full rounded" />
    {uploading && <p className="text-sm text-gray-500">Subiendo imagen...</p>}
    {newCookie.imageUrl && (
      <img src={newCookie.imageUrl} alt="Vista previa" className="w-32 h-32 object-cover mx-auto rounded mt-2" />
    )}

    <button
      type="submit"
      className="bg-yellow-900 hover:bg-yellow-950 text-white py-2 px-4 rounded w-full"
    >
      {editing ? "Actualizar" : "Agregar"} Cookie
    </button>
  </form>

  <div className="space-y-2">
    {cookies.map((cookie) => (
      <div
        key={cookie.id}
        className="border rounded p-3 flex justify-between items-center bg-amber-100"
      >
        <div className="flex items-center gap-3">
          {cookie.imageUrl && <img src={cookie.imageUrl} alt={cookie.name} className="w-12 h-12 rounded object-cover" />}
          <div>
            <p className="font-bold">{cookie.name}</p>
            <p>${cookie.price}</p>
          </div>
          <p>stock: {cookie.stock}</p>
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