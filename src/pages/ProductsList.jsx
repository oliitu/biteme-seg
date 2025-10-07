// src/pages/ProductsList.jsx
import { useEffect, useState, useContext } from "react";
import { collection, getDocs, addDoc, Timestamp, doc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase/config";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import { CartContext } from "../context/CartContext";
import ModalPedido from "../components/ModalPedido";
import ModalWhatsApp from "../components/ModalWhatsApp";
import FormularioResena from "../components/FormularioResena";
import Toast from "../components/Toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsList() {
  // Estados para los modales
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarBotonWhatsApp, setMostrarBotonWhatsApp] = useState(false);
  const [mostrarModalResena, setMostrarModalResena] = useState(false);
  
  // Estados del pedido
  const [clienteNombre, setClienteNombre] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [linkWhatsApp, setLinkWhatsApp] = useState("");
  const [toast, setToast] = useState('');
  
  // Estados de productos
  const [products, setProducts] = useState([]);
  
  // Context del carrito
  const { cart, cartTotal, clearCart } = useContext(CartContext);

  // Efecto para controlar el scroll del body cuando hay modales abiertos
  useEffect(() => {
    document.body.style.overflow = mostrarModal ? 'hidden' : 'auto';
  }, [mostrarModal]);

  // Efecto para el toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Obtener productos de Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cookies"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        console.error("Error al traer productos:", error);
      }
    };

    fetchProducts();
  }, []);

  // Función para generar link de WhatsApp
  const obtenerLinkWhatsApp = () => {
    if (!cart.length || !clienteNombre.trim()) return "";

    const lineaGalletas = cart
      .map(item => `- ${item.name} x${item.quantity} = $${(item.quantity * item.price).toFixed(2)}`)
      .join('\n');

    const mensaje = `Hola mamuuu, soy ${clienteNombre}. Te envío el comprobante de mi pedido:\n${lineaGalletas}\nTotal: $${cartTotal.toFixed(2)}`;

    const numero = "5493541396868";
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  };

  // Función para confirmar pedido
  const confirmarPedido = async () => {
    if (!cart.length || isNaN(cartTotal)) {
      setToast("Error: carrito vacío o total inválido");
      return;
    }

    if (!clienteNombre.trim()) {
      setToast("Por favor ingresá tu nombre");
      return;
    }

    if (!metodoPago) {
      setToast("Elegí un método de pago");
      return;
    }

    setMostrarModal(false);

    const pedido = {
      carrito: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cartTotal,
      cliente: clienteNombre,
      metodo: metodoPago,
      fecha: Timestamp.fromDate(new Date()),
      estado: "en proceso"
    };

    try {
      await addDoc(collection(db, "pedidos"), pedido);
      setToast("Pedido confirmado 🎉");
      
      const link = obtenerLinkWhatsApp();
      setLinkWhatsApp(link);

      // ✅ Calcular totales por chica
      let totalAgus = 0;
      let totalOli = 0;
      let totalGuada = 0;
      const totalGalletas = cart.reduce((acc, item) => acc + item.quantity, 0);
      
      cart.forEach(item => {
        let precioUnitario = item.price;

        // 🔹 Si son exactamente 3 galletas en el pedido → precio promo (2000)
        if (totalGalletas === 3) {
          precioUnitario = 2000;
        }

        const subtotal = precioUnitario * item.quantity;

        if (item.id === 1 || item.id === 5) totalAgus += subtotal;
        if (item.id === 2 || item.id === 3) totalOli += subtotal;
        if (item.id === 4 || item.id === 6) totalGuada += subtotal;
      });

      const totalesRef = collection(db, "totalesPorChica");

      if (totalAgus > 0) {
        await setDoc(doc(totalesRef, "agus"), { [metodoPago]: increment(totalAgus) }, { merge: true });
      }
      if (totalOli > 0) {
        await setDoc(doc(totalesRef, "oli"), { [metodoPago]: increment(totalOli) }, { merge: true });
      }
      if (totalGuada > 0) {
        await setDoc(doc(totalesRef, "guada"), { [metodoPago]: increment(totalGuada) }, { merge: true });
      }

      clearCart();
      setClienteNombre('');

      if (metodoPago === "efectivo") {
        setMostrarModalResena(true);
      } else {
        setMostrarBotonWhatsApp(true);
      }
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      setToast("Error al confirmar el pedido");
    }
  };

  return (
    <>
      {/* Cart Component */}
      <div>
        <Cart isStickyCart={true} setMostrarModal={setMostrarModal} />
      </div>

      {/* Sección de productos */}
      <section className="align-items-center pt-10 lg:pt-20 pb-4 lg:pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-7 lg:mb-13">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-pacifico text-orange-950 mb-2 lg:mb-5">
            Nuestras Cookies
          </h2>
          <p className="text-lg lg:text-xl font-poppins text-orange-950">
            Elegí tu promo en nuestro instagram
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 lg:gap-y-10 lg:gap-x-8 gap-2 sm:gap-y-3 md:m-1 sm:mx-4 justify-items-center lg:mx-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Modal de Pedido */}
      <ModalPedido
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        cart={cart}
        cartTotal={cartTotal}
        clienteNombre={clienteNombre}
        setClienteNombre={setClienteNombre}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        confirmarPedido={confirmarPedido}
        confirmando={false}
      />

      {/* Modal de WhatsApp */}
      {mostrarBotonWhatsApp && (
        <ModalWhatsApp
          linkWhatsApp={linkWhatsApp}
          setMostrarBotonWhatsApp={setMostrarBotonWhatsApp}
          setMostrarModalResena={setMostrarModalResena}
          setToast={setToast}
        />
      )}

      {/* Modal de Reseña */}
      {mostrarModalResena && (
        <div className="fixed inset-0 z-[60] backdrop-blur-sm bg-yellow-950/35 flex items-center justify-center">
          <div className="bg-amber-100 rounded-xl pt-12 px-6 pb-6 w-11/12 max-w-md text-center shadow-lg relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMostrarModalResena(false)}
              className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
            >
              X
            </motion.button>

            <FormularioResena 
              onClose={() => {
                setMostrarModalResena(false);
                setToast("¡Gracias por tu reseña!");
              }} 
            />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast message={toast} />}
      </AnimatePresence>
    </>
  );
}