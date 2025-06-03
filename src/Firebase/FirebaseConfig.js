// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { VITE_FIREBASE__API_KEY, VITE_FIREBASE__AUTH_DOMAIN, VITE_FIREBASE__DATABASE_URL, VITE_FIREBASE__PROJECT_ID, VITE_FIREBASE__STORAGE_BUCKET, VITE_FIREBASE__MESSAGING_SENDER_ID, VITE_FIREBASE__APP_ID } from "@env/vite.env";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE__API_KEY, // Your web app's Firebase configuration
  authDomain: import.meta.env.VITE_FIREBASE__AUTH_DOMAIN, // Your web app's Firebase configuration
  databaseURL: import.meta.env.VITE_FIREBASE__DATABASE_URL, // Your web app's Firebase configuration
  projectId: import.meta.env.VITE_FIREBASE__PROJECT_ID, // Your web app's Firebase configuration
  storageBucket: import.meta.env.VITE_FIREBASE__STORAGE_BUCKET, // Your web app's Firebase configuration
  messagingSenderId: import.meta.env.VITE_FIREBASE__MESSAGING_SENDER_ID, // Your web app's Firebase configuration
  appId: import.meta.env.VITE_FIREBASE__APP_ID, // Your web app's Firebase configuration
};

// Initialize Firebase
export const appFirebase = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(appFirebase);
export default db; // Export the db instance