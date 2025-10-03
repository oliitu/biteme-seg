function AdminLogin() {
  return (
    <div className="max-w-sm mx-auto border p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Login Admin</h2>
      <input type="text" placeholder="Usuario" className="border p-2 w-full mb-2" />
      <input type="password" placeholder="Contraseña" className="border p-2 w-full mb-2" />
      <button className="bg-blue-600 text-white w-full py-2 rounded">Ingresar</button>
    </div>
  )
}

export default AdminLogin
