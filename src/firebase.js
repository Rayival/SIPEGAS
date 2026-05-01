import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiken94UzvOf_CHknF_y22Fy6GL9LTBxg",
  authDomain: "si-tugas-ganjar.firebaseapp.com",
  projectId: "si-tugas-ganjar",
  storageBucket: "si-tugas-ganjar.firebasestorage.app",
  messagingSenderId: "615544333929",
  appId: "1:615544333929:web:a70f10785afe327690e4f8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);