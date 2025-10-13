// Resumenes.jsx

import { useState, useEffect } from 'react';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot // Importación necesaria
} from 'firebase/firestore';

// 🛑 ¡VERIFICA ESTA RUTA! Debe apuntar a tu archivo de inicialización de Firebase.
import { db } from "../firebase/config"; 

// El hook ya no recibe 'db' como argumento.
export const useResumenesDiarios = () => { 
  const [resumenes, setResumenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Define la consulta
    // 'db' debe ser una instancia de Firestore válida aquí.
    const q = query(collection(db, "resumenesDiarios"), orderBy("fecha", "desc"));
    
    // 2. Suscribirse a los cambios usando onSnapshot
    const unsubscribe = onSnapshot(q, 
      // 🟢 Función de Éxito (Manejo de Datos)
      (querySnapshot) => {
        
        // 🚨 Lógica esencial: Mapear los documentos a un array de objetos
        const resumenesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          // Los datos del documento
          ...doc.data(), 
        }));

        setResumenes(resumenesList);
        setLoading(false); // ✅ Desactivar la carga al recibir los datos
        setError(null);
      
      }, 
      // 🔴 Función de Error (Manejo de Errores)
      (err) => {
        
        console.error("Error al suscribirse a resúmenes:", err);
        setError(err);
        setLoading(false); // ✅ Desactivar la carga si hay un error
      }
    );

    // 3. Función de limpieza
    return () => unsubscribe();
    
  }, []); // Dependencia vacía para que se ejecute una sola vez

  return { resumenes, loading, error };
};