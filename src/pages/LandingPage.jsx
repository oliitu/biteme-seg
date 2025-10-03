import {useEffect, useState } from 'react'
import Header from '../components/Header'
import ResenasList from '../components/ResenasList'
import FormularioResena from '../components/FormularioResena'
import { motion } from "framer-motion";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";


function App() {
  const [ruta, setRuta] = useState("");

  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const docRef = doc(db, "misrutas", "2"); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRuta(data.title); 
        } else {
          console.log("No se encontró el documento con ID 2");
        }
      } catch (error) {
        console.error("Error al obtener la ruta:", error);
      }
    };

    fetchRuta();
  }, []);

 
  return (
    <>
    <Header/>
    <main className="max-w-6xl mx-auto ">
      <section className="pt-12 sm:pt-16 pb-6 px-4 sm:px-6">
  <div className="max-w-6xl mx-auto">
  <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto sm:overflow-visible px-4 sm:px-0 snap-x snap-mandatory scroll-smooth">
    
    {/* Card 1 */}
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="min-w-[80%] sm:min-w-0 bg-amber-100 rounded-xl shadow-md hover:shadow-lg p-4 sm:p-6 snap-start"
    >
      <img
        src="/img/ingredientes.png"
        className="h-36 sm:h-48 md:h-60 hover:scale-105 transition-transform duration-300 mx-auto mb-4"
        alt="ingredientes"
      />
      <h3 className="text-lg sm:text-xl text-orange-950 font-poppins mb-2">
        Ingredientes Naturales
      </h3>
      <p className="text-sm sm:text-base font-poppins text-yellow-950">
        Nuestras cookies no contienen ningún tipo de conservantes o aditivos artificiales.
      </p>
    </motion.div>

    {/* Card 2 */}
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="min-w-[80%] sm:min-w-0 bg-amber-100 rounded-xl shadow-md hover:shadow-lg p-4 sm:p-6 snap-start"
    >
      <img
        src="/img/receta.png"
        className="drop-shadow-lg hover:drop-shadow-sm h-36 sm:h-48 md:h-60 hover:scale-105 transition-transform duration-300 mx-auto mb-4"
        alt="receta secreta"
      />
      <h3 className="text-lg sm:text-xl text-orange-950 font-poppins mb-2">
        Recetas Verificadas
      </h3>
      <p className="text-sm sm:text-base font-poppins text-yellow-950">
        Usamos las mejores recetas, aprobadas por todos nuestros clientes.
      </p>
    </motion.div>

    {/* Card 3 */}
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="min-w-[80%] sm:min-w-0 bg-amber-100 rounded-xl shadow-md hover:shadow-lg p-4 sm:p-6 snap-start"
    >
      <img
        src="/img/chef.png"
        className="drop-shadow-lg hover:drop-shadow-sm h-36 sm:h-48 md:h-60 hover:scale-105 transition-transform duration-300 mx-auto mb-4"
        alt="chef"
      />
      <h3 className="text-lg sm:text-xl text-orange-950 font-poppins mb-2">
        Hechas por Profesionales
      </h3>
      <p className="text-sm sm:text-base font-poppins text-yellow-950">
        Tenemos experiencia horneando cookies desde hace más de 5 años.
      </p>
    </motion.div>

  </div>
</div>

</section>
<div className=" flex items-center justify-center">
    <motion.a whileTap={{ scale: 0.95 }} href={ruta || "#"} className="text-white  bg-[#51290e] hover:bg-yellow-950 mt-4 rounded-full text-lg lg:text-2xl px-5 p-2.5 text-center" >Quiero mis cookies!</motion.a>
  </div>




  <section id="productos" className="align-items-center pt-10 lg:pt-10 pb-6 lg:pb-16 px-6">
  <div className="max-w-6xl mx-auto mt-6 text-center mb-10">
    <h2 className="text-3xl md:text-4xl lg:text-6xl font-pacifico text-orange-950 mb-4">Catálogo</h2>
  </div>




</section>
 <section className='mt-9'>
  <h3 className='text-2xl md:text-3xl lg:text-5xl font-pacifico font-bold text-orange-950 mb-8 ' >Reseñas de nuestros clientes</h3>
    
    <FormularioResena />
  <ResenasList/>
 </section>
  </main>
  <footer className="w-full bg-[#51290e] mt-10 pt-10 px-4">
  <div className="text-center">
    <p className="text-white font-poppins text-lg">Nuestras redes sociales</p>

    <div className="py-4 flex items-center justify-center gap-6">
      <motion.a
        whileTap={{ scale: 0.95 }}
        href="https://www.instagram.com/biteme_vcp"
        target="_blank"
      >
        <img src="/img/ig.png" className="h-10 sm:h-12" alt="Instagram" />
      </motion.a>

      <motion.a
        whileTap={{ scale: 0.95 }}
        href="https://www.tiktok.com/@biteme.vcp"
        target="_blank"
      >
        <img src="/img/tt.png" className="h-10 sm:h-12" alt="TikTok" />
      </motion.a>
    </div>

    <p className="font-poppins text-sm sm:text-base text-white pb-6">
      Iturrusgarai, Cisneros y Espósito
    </p>
  </div>
</footer>
  </>
  
  )
}

export default App
