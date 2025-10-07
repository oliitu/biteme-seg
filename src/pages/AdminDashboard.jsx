import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config"; // Ajusta la ruta según tu estructura
import { useAuth } from "../hooks/useAuth"; // Ajusta la ruta

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminEmail");
      navigate("/admin-login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Intenta nuevamente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      {/* Header con información del usuario */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-amber-900 font-poppins">
          Panel de Administración
        </h2>
        {user && (
          <div className="text-sm text-gray-600 mb-4">
            <p>Conectado como: <span className="font-semibold">{user.email}</span></p>
          </div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex flex-col gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-105"
        >
          📦 Ver Pedidos
        </button>
        <button
          onClick={() => navigate("/admin/cookies")}
          className="bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-105"
        >
          🍪 Gestionar Cookies
        </button>
      </div>

      {/* Botón de logout */}
      <div className="border-t pt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}