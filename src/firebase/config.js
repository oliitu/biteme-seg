// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQA9SGKYLuNKoVvieOgNNGbWN3zrWsqHs",
  authDomain: "biteme-seg.firebaseapp.com",
  projectId: "biteme-seg",
  storageBucket: "biteme-seg.firebasestorage.app",
  messagingSenderId: "699663352333",
  appId: "1:699663352333:web:7786b8aeb89d18db288b44"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);