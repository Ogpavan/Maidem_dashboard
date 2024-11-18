// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZMKj_IxGUmcyCmKiII4LjarsikznQeLc",
  authDomain: "maidem-94dce.firebaseapp.com",
  projectId: "maidem-94dce",
  storageBucket: "maidem-94dce.firebasestorage.app",
  messagingSenderId: "137369553802",
  appId: "1:137369553802:web:2e6ba502ed70f906929673",
  measurementId: "G-TS2F1HVR3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



export { db };