// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8d-HUvg0XSDtjFLtUSmebH3SSlQtX0ws",
  authDomain: "commercial-login.firebaseapp.com",
  projectId: "commercial-login",
  storageBucket: "commercial-login.firebasestorage.app",
  messagingSenderId: "1079085609831",
  appId: "1:1079085609831:web:470f7a4482c6f7041375c2",
  measurementId: "G-S7JVEX0RGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);