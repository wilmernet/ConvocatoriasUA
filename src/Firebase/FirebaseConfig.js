// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQfAvCSDjVpV9c01cCgSxVRQj4GfdNb-4",
  authDomain: "modulosudla-75270.firebaseapp.com",
  projectId: "modulosudla-75270",
  storageBucket: "modulosudla-75270.firebasestorage.app",
  messagingSenderId: "497075319825",
  appId: "1:497075319825:web:325966dcc2b4b357e7adb0"
};

// Initialize Firebase
export const appFirebase = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(appFirebase);
export default db; // Export the db instance