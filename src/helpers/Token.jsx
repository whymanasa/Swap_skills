import CryptoJS from 'crypto-js';
import { db } from '../../firebase-config'; // Adjust the path as necessary
import { doc, setDoc } from 'firebase/firestore';

// Function to generate a secure token
export const generateToken = (userId) => {
    const secret = import.meta.env.VITE_SECRET_KEY; // Access the secret key from environment variables // Use a secure secret key
  return CryptoJS.HmacSHA256(userId, secret).toString(CryptoJS.enc.Hex);
};

// Function to create a user profile and store the token
export const createUserProfile = async (userId, userName) => {
  const token = generateToken(userId);
  await setDoc(doc(db, 'profile', userId), {
    name: userName,
    token: token, // Store the generated token
    // other user data...
  });
};
