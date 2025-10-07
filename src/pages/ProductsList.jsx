// src/pages/ProductsList.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";


export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useContext(CartContext);
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
    
    <section  className="align-items-center pt-10 lg:pt-20 pb-4 lg:pb-16 px-6">
     <div> <Cart isStickyCart={true} />
</div> 
  <div className="max-w-6xl mx-auto text-center mb-7 lg:mb-13">
    <h2 className="text-3xl md:text-5xl lg:text-7xl font-pacifico text-orange-950 mb-2 lg:mb-5">Nuestras Cookies</h2>
    <p className="text-lg lg:text-xl font-poppins text-orange-950">Elegí tu promo en nuestro instagram</p>
  </div>
    <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-3  lg:gap-y-10 lg:gap-x-8 gap-2  sm:gap-y-3 md:m-1 sm:mx-4 justify-items-center lg:mx-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
    </section>
  );
}
