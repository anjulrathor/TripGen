"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GoogleAuthButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function login() {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl border border-border bg-white dark:bg-neutral-900 shadow-sm">
        <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter font-black text-muted-foreground leading-none">Logged in as</span>
            <span className="text-xs font-bold text-foreground">
              {user.displayName?.split(" ")[0] || "User"}
            </span>
        </div>
        <img
          src={user.photoURL}
          alt="profile"
          className="w-8 h-8 rounded-full ring-2 ring-primary/20"
        />

        <button
          onClick={logout}
          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={login}
      disabled={loading}
      className="group relative flex items-center gap-3 px-6 py-3 bg-white dark:bg-neutral-900 border border-border rounded-2xl shadow-lg shadow-black/5 hover:border-primary/50 hover:shadow-primary/10 transition-all active:scale-95 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      ) : (
        <motion.img
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          className="w-5 h-5"
        />
      )}

      <span className="text-sm font-bold text-foreground">
        {loading ? "Connecting..." : "Continue with Google"}
      </span>
      
      {!loading && (
        <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
      )}
    </motion.button>
  );
}
