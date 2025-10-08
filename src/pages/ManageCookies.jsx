import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ManageCookies() {
const [cookies, setCookies] = useState([]);
const [newCookie, setNewCookie] = useState({ name: "", description: "", price: "", imageUrl: "" });
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

// 📸 Subida de imagen a Cloudinary
const handleImageUpload = async (e) => {
const file = e.target.files[0];
if (!file) return;
setUploading(true);
const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", "biteme-cookies"); // tu preset en Cloudinary
formData.append("cloud_name", "dxpycsyjw"); // reemplazá con tu Cloud name

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

const handleSubmit = async (e) => {
e.preventDefault();
try {
if (editing) {
const ref = doc(db, "cookies", editing);
await updateDoc(ref, newCookie);
} else {
await addDoc(cookiesRef, { ...newCookie, price: Number(newCookie.price) });
}
setNewCookie({ name: "", description: "", price: "", stock: "", imageUrl: "" });
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