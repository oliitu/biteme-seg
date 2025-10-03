import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminLogin() {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // 👇 credenciales "fijas"
    const ADMIN_USER = "admin"
    const ADMIN_PASS = "1234"

    if (usuario === ADMIN_USER && password === ADMIN_PASS) {
      // Guardar sesión en localStorage
      localStorage.setItem("isAdmin", "true")
      navigate("/admin") // redirigir al panel
    } else {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="max-w-sm mx-auto border p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
