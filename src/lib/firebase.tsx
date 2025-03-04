// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCg-9q0q9S9FCYTZhWZ3YVn7KawXxPjVS0",
    authDomain: "react-chatbot-4bbbb.firebaseapp.com",
    projectId: "react-chatbot-4bbbb",
    storageBucket: "react-chatbot-4bbbb.firebasestorage.app",
    messagingSenderId: "599175925855",
    appId: "1:599175925855:web:e57b95a2280bd0d2000bea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();
export const googleProvider = new GoogleAuthProvider();