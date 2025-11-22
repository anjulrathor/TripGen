"use client";
import React, { useState, useEffect, useRef } from "react";
import GoogleLoginButton from "../GoogleLoginButton";
import Link from "next/link";
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // ⭐ avatar dropdown
  const menuRef = useRef(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  // ⭐ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setMenuOpen(false);
  }

  return (
    <header className="bg-black border-b border-white/10">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-sm overflow-hidden">
              {/* <img
                src="sandbox:/mnt/data/c0f56289-230f-401f-a74e-14bba8928f0a.png"
                alt="logo"
                className="w-full h-full object-cover"
              /> */}
            </div>
            <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-extrabold text-lg tracking-tight">
              TRIPGEN
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>

            {user && (
              <>
                <Link href="/create-trip" className="text-gray-400 hover:text-white transition">Create Trip</Link>
                <Link href="/my-trips" className="text-gray-400 hover:text-white transition">My Trips</Link>
              </>
            )}

            <Link href="/developer" className="text-gray-400 hover:text-white transition">
              Meet the Developer
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">

            {/* ⭐ User avatar OR Google Login */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:ring-2 hover:ring-cyan-400 transition"
                >
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* ⭐ Avatar Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-white/10 rounded-lg shadow-xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-white text-sm font-semibold truncate">{user.displayName}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/create-trip"
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      Create Trip
                    </Link>

                    <Link
                      href="/my-trips"
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Trips
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <GoogleLoginButton />
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/3 transition"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                {open ? (
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                ) : (
                  <path
                    d="M3 7h18M3 12h18M3 17h18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-200 ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 border-t border-white/5 bg-black/95">
          <div className="flex flex-col gap-4">

            <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>

            {user ? (
              <>
                <Link href="/create-trip" className="text-gray-300 hover:text-white transition">Create Trip</Link>
                <Link href="/my-trips" className="text-gray-300 hover:text-white transition">My Trips</Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-400 hover:text-red-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <GoogleLoginButton />
              </>
            )}

            <Link href="/developer" className="text-gray-300 hover:text-white transition">Meet the Developer</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
