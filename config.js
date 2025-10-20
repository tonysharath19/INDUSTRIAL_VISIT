// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2r1Lq4yaHllOG4mbSytFbDIEvcuwmeSQ",
  authDomain: "industry-visit-e5d29.firebaseapp.com",
  projectId: "industry-visit-e5d29",
  storageBucket: "industry-visit-e5d29.firebasestorage.app",
  messagingSenderId: "1022386967609",
  appId: "1:1022386967609:web:f30b891c7a566a63a3a9e8",
  measurementId: "G-FE4W7WTDFZ"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
window.db = getFirestore(app);
window.auth = getAuth(app);
