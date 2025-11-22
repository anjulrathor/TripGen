"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfhHGSnWDNX7f4CdwuaBXrG-58PwFWVgM",
  authDomain: "tripgen-0.firebaseapp.com",
  projectId: "tripgen-0",
  storageBucket: "tripgen-0.firebasestorage.app",
  messagingSenderId: "30450074722",
  appId: "1:30450074722:web:70252e1c7f60e7f20b7d3b",
  measurementId: "G-NNXWRE4V0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
