import { useCart } from '../context/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col items-center">
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-32 h-32 object-cover mb-2"
      />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Agregar al Carrito
      </button>
    </div>
  )
}

export default ProductCard
