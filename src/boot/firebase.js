// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAnaAhIthhSLaq5KQYFIvmwLQpc8ghSZ4",
  authDomain: "yatter-a086c.firebaseapp.com",
  projectId: "yatter-a086c",
  storageBucket: "yatter-a086c.appspot.com",
  messagingSenderId: "404135394863",
  appId: "1:404135394863:web:3eebc7ea3ca6d915f410da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
