"use client";

import { auth } from "@/firebase/firebaseConfig";

export default function AuthCheck() {
  function checkUser() {
    console.log("auth.currentUser =", auth.currentUser);
  }

  return (
    <button
      onClick={checkUser}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Check Login
    </button>
  );
}
