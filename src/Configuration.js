import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALENjlrdfv0qktbWf9Cc5fGTRWDKtoNsI",
  authDomain: "catechsolution.firebaseapp.com",
  projectId: "catechsolution",
  storageBucket: "catechsolution.appspot.com", // ✅ Corrected
  messagingSenderId: "311704816852",
  appId: "1:311704816852:web:4d1f032345179658acff41",
  measurementId: "G-SMWY68V5PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, db, auth, provider };