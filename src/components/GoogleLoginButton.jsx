"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function GoogleAuthButton() {
  const [user, setUser] = useState(null);

  // Listen for login/logout status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // null if logged out
    });
    return () => unsubscribe();
  }, []);

  async function login() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login Error:", err);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  }

  // If logged in → show user card
  if (user) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-xl border shadow-sm bg-white">
        <img
          src={user.photoURL}
          alt="profile"
          className="w-8 h-8 rounded-full border"
        />
        <span className="text-sm font-medium">
          {user.displayName?.split(" ")[0] || "User"}
        </span>

        <button
          onClick={logout}
          className="ml-auto px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Logout
        </button>
      </div>
    );
  }

  // Before login → show Google button
 return (
  <button
    onClick={login}
    className="flex items-center gap-3 px-5 py-3 bg-white border rounded-xl shadow-sm hover:bg-gray-50 transition"
  >
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="Google Logo"
      className="w-5 h-5"
    />

    <span className="text-sm font-medium text-gray-700">
      Sign in with Google
    </span>
  </button>
);


}
