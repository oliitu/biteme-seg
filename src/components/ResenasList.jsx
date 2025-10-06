
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { motion, AnimatePresence } from "framer-motion";

function ResenasList() {
  const [resenas, setResenas] = useState([]);

  useEffect(() => {
    const resenasRef = collection(db, "resenas");
    const resenasQuery = query(resenasRef, orderBy("fecha", "desc"));

    const unsubscribe = onSnapshot(resenasQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResenas(data);
    });

    return () => unsubscribe();
  }, []);

  const Estrellas = ({ cantidad }) => (
  <div className="flex justify-center space-x-1 my-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        fill={i <= cantidad ? "#facc15" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5 text-yellow-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.248 3.828a1 1 0 00.95.69h4.016c.969 0 1.371 1.24.588 1.81l-3.25 2.36a1 1 0 00-.364 1.118l1.249 3.828c.3.921-.755 1.688-1.538 1.118l-3.25-2.36a1 1 0 00-1.175 0l-3.25 2.36c-.783.57-1.838-.197-1.538-1.118l1.249-3.828a1 1 0 00-.364-1.118l-3.25-2.36c-.783-.57-.38-1.81.588-1.81h4.016a1 1 0 00.95-.69l1.248-3.828z"
        />
      </svg>
    ))}
  </div>
);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      <AnimatePresence>
        {resenas.map((resena) => (
          <motion.div
            key={resena.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            layout
            className="bg-amber-100 rounded-xl shadow-md p-5 flex flex-col justify-between h-full"
          >
            <h3 className="text-lg font-bold font-poppins text-yellow-900 mb-2">{resena.name}</h3>
            <p className="text-gray-700 font-poppins">“{resena.opinion}”</p>
            <Estrellas cantidad={resena.rating || 0} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


export default ResenasList;
