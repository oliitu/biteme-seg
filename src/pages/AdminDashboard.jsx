
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white text-center">
      <h2 className="text-2xl font-bold mb-6 text-amber-900 font-poppins">
        Panel de Administración
      </h2>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-amber-700 hover:bg-amber-800 text-white py-2 rounded-lg font-semibold"
        >
          Ver pedidos
        </button>
        <button
          onClick={() => navigate("/admin/cookies")}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold"
        >
          Gestionar cookies
        </button>
      </div>
    </div>
  );
}

