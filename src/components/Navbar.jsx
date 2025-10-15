import { Link } from 'react-router-dom'

function Navbar() {

  return (
    <nav className="bg-yellow-950 z-50 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="font-bold sm:text-base text-sm">BiteMe</Link>
        <Link to="/productos" className="sm:text-base text-sm">Comprar</Link>
        <Link to="/admin" className="sm:text-base text-sm">Admin</Link>
      </div>
      
    </nav>
  )
}

export default Navbar
