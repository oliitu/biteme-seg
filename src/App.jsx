import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ProductsList from './pages/ProductsList'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import OrdersList from "./pages/OrdersList";
import ResumenesList from "./pages/ResumenesList";
import ManageCookies from "./pages/ManageCookies";
import ManagePromo from './pages/ManagePromo';

function PrivateRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  return isAdmin ? children : <Navigate to="/admin-login" />
}


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/productos" element={<ProductsList />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
             <Route path="/admin-login" element={<AdminLogin />} />
              <Route
  path="/admin/orders"
  element={
    <PrivateRoute>
      <OrdersList />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/resumenes"
  element={
    <PrivateRoute>
      <ResumenesList />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/cookies"
  element={
    <PrivateRoute>
      <ManageCookies />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/promos"
  element={
    <PrivateRoute>
      <ManagePromo />
    </PrivateRoute>
  }
/>
        </Routes>
      </main>
    </div>
  )
}

export default App
