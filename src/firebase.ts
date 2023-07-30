import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoMiP19h67pXDByOSL6o_lLAWUKmrY5es",
  authDomain: "hungryturtle-d400f.firebaseapp.com",
  projectId: "hungryturtle-d400f",
  storageBucket: "hungryturtle-d400f.appspot.com",
  messagingSenderId: "717422626101",
  appId: "1:717422626101:web:2d99b2a2eab6bd7b8af87c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
