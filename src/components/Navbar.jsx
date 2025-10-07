import { Link } from 'react-router-dom'

function Navbar() {

  return (
    <nav className="bg-yellow-900 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="font-bold">Mi Tienda</Link>
        <Link to="/productos">Productos</Link>
        
      </div>
      <Link to="/admin">Admin</Link>
    </nav>
  )
}

export default Navbar
