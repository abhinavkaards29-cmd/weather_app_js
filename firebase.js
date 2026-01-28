import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAL0squLR2-yJy84k0xP7hfm-ox11tkdgc",
  authDomain: "abhinav-weather-ai.firebaseapp.com",
  projectId: "abhinav-weather-ai",
  storageBucket: "abhinav-weather-ai.appspot.com",
  messagingSenderId: "204867412715",
  appId: "1:204867412715:web:a0f2c59be1167bb7b3d4ae",
  measurementId: "G-ZYBBFG5XV1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
