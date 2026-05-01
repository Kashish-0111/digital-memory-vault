import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtuZuv-NQGz2ubmV_0UKI8pgv6El0FU58",
  authDomain: "digital-memory-vault.firebaseapp.com",
  projectId: "digital-memory-vault",
  storageBucket: "digital-memory-vault.firebasestorage.app",
  messagingSenderId: "813188809272",
  appId: "1:813188809272:web:661fbca1c3f5957f9f9ccd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);