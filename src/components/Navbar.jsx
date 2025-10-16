// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import PromoBar from "./PromoBar";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

function Navbar() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const now = new Date();

        // 🔹 Obtener promos globales (desde ManagePromo)
        const promosSnap = await getDocs(collection(db, "promos"));
        const promosData = promosSnap.docs
  .map((doc) => ({ id: doc.id, ...doc.data() }))
  .filter((p) => {
    if (!p.activo || !p.inicio || !p.fin) return false;
    const now = new Date();
    const inicio = p.inicio.seconds ? new Date(p.inicio.seconds * 1000) : new Date(p.inicio);
    const fin = p.fin.seconds ? new Date(p.fin.seconds * 1000) : new Date(p.fin);
    return now >= inicio && now <= fin;
  })
  .map((p) => ({
    id: p.id,
    title: p.title,
    motivo: p.motivo,
    descuento: p.descuento,
    inicio: p.inicio.seconds ? new Date(p.inicio.seconds * 1000) : new Date(p.inicio),
    fin: p.fin.seconds ? new Date(p.fin.seconds * 1000) : new Date(p.fin),
    tipo: "global",
  }));


        // 🔹 Obtener promos por cookie (desde colección "cookies")
        const cookiesSnap = await getDocs(collection(db, "cookies"));
        const cookiesData = cookiesSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (c) =>
              c.promoStart &&
              c.promoEnd &&
              new Date(c.promoStart) <= now &&
              new Date(c.promoEnd) >= now
          )
          .map((c) => ({
            id: c.id,
            name: c.name,
            specialPrice: c.specialPrice,
            inicio: c.promoStart,
            fin: c.promoEnd,
            tipo: "cookie",
          }));

        // 🔹 Combinar ambas listas
        setPromos([...promosData, ...cookiesData]);
      } catch (error) {
        console.error("Error al obtener promos:", error);
      }
    };

    fetchPromos();
  }, []);

  return (
    <div className="relative z-50">
      <nav className="bg-yellow-950 text-white p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="font-bold sm:text-base text-sm">
            BiteMe
          </Link>
          <Link to="/productos" className="sm:text-base text-sm">
            Comprar
          </Link>
          <Link to="/admin" className="sm:text-base text-sm">
            Admin
          </Link>
        </div>
      </nav>
      {promos.map((promo) => (
        <PromoBar key={promo.id} promo={promo} />
      ))}
    </div>
  );
}

export default Navbar;
