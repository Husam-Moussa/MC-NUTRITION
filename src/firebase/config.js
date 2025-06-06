import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCAzuQGrzLRteRC4U3f23a4-_kzOhr7XmE",
  authDomain: "mcnutrition-38855.firebaseapp.com",
  projectId: "mcnutrition-38855",
  storageBucket: "mcnutrition-38855.appspot.com",
  messagingSenderId: "243230550310",
  appId: "1:243230550310:web:1a0e100b08a65b1e3df9e7",
  measurementId: "G-T9R3QGRX2R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app); 