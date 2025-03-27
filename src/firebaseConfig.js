import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANy7Nuowelh9yF9xawE8wL7wWxnxIMiAo",
  authDomain: "strength-notes.firebaseapp.com",
  projectId: "strength-notes",
  storageBucket: "strength-notes.firebasestorage.app",
  messagingSenderId: "514638419195",
  appId: "1:514638419195:web:05d2faf46cc11bd6b64c5e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);