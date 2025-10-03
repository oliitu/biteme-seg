import ProductCard from '../components/ProductCard'

const mockProducts = [
  { id: 1, name: "Producto 1", price: 100 },
  { id: 2, name: "Producto 2", price: 200 },
  { id: 3, name: "Producto 3", price: 300 }
]

function ProductsList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {mockProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

export default ProductsList
