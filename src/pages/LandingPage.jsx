import Header from '../components/Header'
import ResenasList from '../components/ResenasList'
import FormularioResena from '../components/FormularioResena'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom'



function App() {
 
 
  return (
    <>
    <Header/>
    <main className="max-w-6xl mx-auto text-center">
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
    <Link to="/productos" whileTap={{ scale: 0.95 }} className="text-white  bg-[#51290e] hover:bg-yellow-950 mt-4 rounded-full text-lg lg:text-2xl px-5 p-2.5 text-center" >Quiero mis cookies!</Link>
  </div>





 <section className='mt-9'>
  <h3 className='text-2xl md:text-3xl lg:text-5xl font-pacifico font-bold text-orange-950 mt-3 mb-2 sm:mt-20 sm:mb-8 ' >Reseñas de nuestros clientes</h3>
    
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
