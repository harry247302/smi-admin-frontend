import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAB6iww5athvTxjG7Z5Tt69_v0JqJewDg0",
  authDomain: "smilessence-8e030.firebaseapp.com",
  databaseURL: "https://smilessence-8e030-default-rtdb.firebaseio.com",
  projectId: "smilessence-8e030",
  storageBucket: "smilessence-8e030.appspot.com", // <-- corrected
  messagingSenderId: "395742557333",
  appId: "1:395742557333:web:b8ae1cdaceeb97c70a179c",
  measurementId: "G-VY553DG9ZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const storage = getStorage(app);
export const firestore = getFirestore(app);
