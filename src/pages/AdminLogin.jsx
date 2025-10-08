import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/config"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // 👇 Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 👇 Verificar si el usuario es admin
      const adminEmails = ["admin@tudominio.com", "oliviaiturrusgarai@iresm.edu.ar"]
      
      if (adminEmails.includes(user.email)) {
        // Guardar información de sesión
        localStorage.setItem("isAdmin", "true")
        localStorage.setItem("adminEmail", user.email)
        
        navigate("/admin") // redirigir al panel
      } else {
        setError("No tienes permisos de administrador")
        // Cerrar sesión si no es admin
        await auth.signOut()
        localStorage.removeItem("isAdmin")
        localStorage.removeItem("adminEmail")
      }

    } catch (error) {
      console.error("Error de autenticación:", error)
      
      // 👇 Manejar diferentes tipos de errores
      switch (error.code) {
        case "auth/invalid-email":
          setError("El formato del email es inválido")
          break
        case "auth/user-disabled":
          setError("Esta cuenta ha sido deshabilitada")
          break
        case "auth/user-not-found":
          setError("No existe una cuenta con este email")
          break
        case "auth/wrong-password":
          setError("Contraseña incorrecta")
          break
        case "auth/too-many-requests":
          setError("Demasiados intentos fallidos. Intenta más tarde")
          break
        default:
          setError("Error al iniciar sesión. Intenta nuevamente")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-amber-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-yellow-900">Logueate</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email administrativo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff84ad] focus:border-transparent"
            required
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff84ad] focus:border-transparent"
            required
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-2 px-4 rounded-md bg-[#ff84ad] hover:bg-[#ce5980] focus:outline-none focus:ring-2 focus:ring-[#ff84ad] focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </span>
          ) : (
            "Ingresar al Panel"
          )}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin