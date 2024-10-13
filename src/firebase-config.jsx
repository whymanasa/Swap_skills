// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDIwLvE8HAOrewaFB0XyqQc7wPSx1lkpQ4",
  authDomain: "swap-em-24152.firebaseapp.com",
  projectId: "swap-em-24152",
  storageBucket: "swap-em-24152.appspot.com",
  messagingSenderId: "825127939835",
  appId: "1:825127939835:web:e70b75747846e30fd90a5e",
  measurementId: "G-8TSGEG81WM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);