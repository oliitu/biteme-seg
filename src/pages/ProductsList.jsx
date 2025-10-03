// src/pages/ProductsList.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useCart } from "../context/useCart";
import ProductCard from "../components/ProductCard";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cookies"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        console.error("Error al traer productos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-3  lg:gap-y-10 lg:gap-x-8 gap-2  sm:gap-y-3 md:m-1 sm:mx-4 justify-items-center lg:mx-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
}
