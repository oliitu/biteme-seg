import { motion } from "framer-motion";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext); // ahora lo usamos desde contexto
  const { name, image, description, price } = product;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
    >
      <div className="bg-radial from-amber-100 from-40% to-[#fff1bf] rounded-xl hover:drop-shadow-xl shadow py-2 md:py-6 md:px-4 lg:py-6 lg:px-4 text-center flex flex-col h-full">
        <motion.img
          whileHover={{ rotate: 40 }}
          transition={{ duration: 0.3 }}
          src={`/img/${image}.png`}
          alt={name}
          className="drop-shadow-lg hover:drop-shadow-xl rounded-lg h-18 xs:h-24 sm:h-28 md:h-36 lg:h-48 mx-auto object-contain mt-2 lg:mt-0 mb-2 lg:mb-4"
        />
        <h3 className="font-pacifico text-orange-950 text-xl sm:text-2xl lg:text-3xl mb-2">
          {name}
        </h3>
        <p className="mb-2 mx-2 text-xs sm:text-base text-orange-950 font-poppins flex-grow">
          {description}
        </p>
        <p className="font-poppins text-[#220d06] font-bold text-sm md:text-lg lg:text-lg mb-0 md:mb-2 lg:mb-2">
          ${price}
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="font-poppins cursor-pointer bg-amber-900 text-white hover:bg-amber-950 mb-0.5 px-1.5 py-0.5 lg:px-3 lg:py-2 md:px-3 md:py-2 mt-1.5 md:mt-3 lg:mt-3 rounded-2xl text-xs lg:text-sm md:text-sm w-fit mx-auto"
          onClick={() => addToCart(product)}
        
        >
          Añadir al carrito
        </motion.button>
      </div>
    </motion.div>
  );
}
