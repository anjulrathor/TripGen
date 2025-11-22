"use client";
import React, { useState } from "react";
import GoogleLoginButton from "../GoogleLoginButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-black border-b border-white/10">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-3">
              {/* small badge / mark (optional) */}
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-sm">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M3 12h18"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 7v10"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* CYBERLOGO text with gradient */}
              <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-extrabold text-lg tracking-tight">
                TRIPGEN
              </span>
            </a>
          </div>

          {/* Center: Links (desktop only) */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-400 hover:text-white transition">
              Home
            </a>
            <a href="/create-trip" className="text-gray-400 hover:text-white transition">
              Create Trip
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Docs
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Meet the Developer
            </a>
          </div>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-4">
            
            <GoogleLoginButton />

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/3 transition"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                {open ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M3 7h18M3 12h18M3 17h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transform-gpu origin-top transition-all duration-200 ${
          open
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 border-t border-white/5 bg-black/95">
          <div className="flex flex-col gap-4">
            <a href="#" className="text-gray-300 hover:text-white transition">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              Create Trip
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              Meet Developer
            </a>
           

            <div className="pt-3">
              <a
                href="#"
                className="block text-center px-4 py-2 rounded-lg border border-cyan-400 text-cyan-300 font-medium hover:shadow-[0_0_12px_rgba(34,211,238,0.12)] transition"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
