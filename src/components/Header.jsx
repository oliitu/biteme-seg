import { Link } from 'react-router-dom'
export default function Header() {
  return (
    <header className="w-full h-[50vh] sm:h-[80vh] md:h-[75vh] header bg-cover bg-center flex items-center justify-center" style={{
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/img/header.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "70%",
  }}>
      <section className="px-4 sm:px-6 text-center max-w-3xl">
        <img
          className="mx-auto h-28 sm:h-36 md:h-44 mb-6 transition-all duration-300"
          src="/img/logonobg.png"
          alt="Logo"
        />
        <h1 className="drop-shadow font-pacifico text-white text-2xl sm:text-4xl md:text-5xl font-semibold mb-4">
          ¡Las Cookies más deliciosas!
        </h1>
        <p className="font-poppins text-white text-base sm:text-lg md:text-xl mb-6">
          100% Caseras, horneadas con amor y profesionalismo.
        </p>
        <Link to="/productos" className="inline-block text-white font-semibold font-poppins px-6 py-3 rounded-full text-sm sm:text-base transition"> Ver productos</Link>
        
      </section>
    </header>
  );
}
