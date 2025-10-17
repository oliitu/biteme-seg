import { Link } from "react-router-dom";
import PromoBar from "./PromoBar";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function Navbar() {
  const [promosActivas, setPromosActivas] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const now = new Date();
        const promos = [];

        // 🟣 Promo global
        const globalRef = doc(db, "promos", "global");
        const globalSnap = await getDoc(globalRef);

        if (globalSnap.exists()) {
          const promo = globalSnap.data();
          const inicio = promo.inicio?.seconds
            ? new Date(promo.inicio.seconds * 1000)
            : new Date(promo.inicio);
          const fin = promo.fin?.seconds
            ? new Date(promo.fin.seconds * 1000)
            : new Date(promo.fin);

          if (promo.activo && now >= inicio && now <= fin) {
            promos.push({ id: "global", ...promo });
          }
        }

        // 🍪 Promos por cookie
        const cookiesSnap = await getDocs(collection(db, "cookies"));
        cookiesSnap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.isSpecial && data.promoStart && data.promoEnd) {
            const start =
              typeof data.promoStart === "string"
                ? new Date(data.promoStart)
                : new Date(data.promoStart.seconds * 1000);
            const end =
              typeof data.promoEnd === "string"
                ? new Date(data.promoEnd)
                : new Date(data.promoEnd.seconds * 1000);

            if (now >= start && now <= end) {
              promos.push({ id: docSnap.id, ...data });
            }
          }
        });

        // 🔸 Guardamos todas las activas (global + cookies)
        setPromosActivas(promos);
      } catch (error) {
        console.error("Error al traer promociones:", error);
      }
    };

    fetchPromos();

    // 🔁 Actualizar cada minuto por si alguna se activa o expira
    const interval = setInterval(fetchPromos, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-50">
      {/* 🔸 Todas las promos activas, una debajo de otra */}
      

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
      <div className="flex flex-col ">
        {promosActivas.map((promo) => (
          <PromoBar key={promo.id} promo={promo} />
        ))}
      </div>
    </div>
  );
}

export default Navbar;
