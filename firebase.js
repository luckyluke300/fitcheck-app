import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeC7b6Q_V9uX6ZACof8c-msWUXFGYgQtQ",
  authDomain: "fitcheck-app-6815f.firebaseapp.com",
  projectId: "fitcheck-app-6815f",
  storageBucket: "fitcheck-app-6815f.firebasestorage.app",
  messagingSenderId: "653322635865",
  appId: "1:653322635865:web:8e1b98a260d4f66ad73f48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);