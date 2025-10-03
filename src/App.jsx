import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ProductsList from './pages/ProductsList'
import Cart from './pages/Cart'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/productos" element={<ProductsList />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
