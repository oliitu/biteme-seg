import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { ShoppingCart } from 'lucide-react'

function Navbar() {
  const { items } = useCart()
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <nav className="bg-yellow-900 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="font-bold">Mi Tienda</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/admin">Admin</Link>
      </div>
      <Link to="/carrito" className="relative">
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
    </nav>
  )
}

export default Navbar
