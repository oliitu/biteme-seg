import { useCart } from '../context/useCart'

function Cart() {
  const { items, total } = useCart()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Carrito</h2>
      {items.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between border p-2">
                <span>{item.name} x{item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold">Total: ${total}</p>
        </div>
      )}
    </div>
  )
}

export default Cart
