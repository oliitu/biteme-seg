
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "pedidos"));
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-amber-900 font-poppins text-center">
        Pedidos recibidos
      </h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No hay pedidos aún.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border rounded p-4 bg-amber-50">
              <p><strong>Cliente:</strong> {order.nombre}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Fecha:</strong> {new Date(order.fecha).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

