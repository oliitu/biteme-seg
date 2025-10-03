import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ProductsList from './pages/ProductsList'
import Cart from './pages/Cart'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { Navigate } from "react-router-dom"

function PrivateRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  return isAdmin ? children : <Navigate to="/admin-login" />
}


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/productos" element={<ProductsList />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
             <Route path="/admin-login" element={<AdminLogin />} />

        </Routes>
      </main>
    </div>
  )
}

export default App
