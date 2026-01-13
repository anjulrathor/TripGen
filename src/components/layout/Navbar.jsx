"use client";
import React, { useState, useEffect, useRef } from "react";
import GoogleLoginButton from "../GoogleLoginButton";
import Link from "next/link";
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut, Plane, Map, Plus, ExternalLink, Globe, Info, LogIn } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsub();
    };
  }, []);

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

  const navLinks = [
    { name: "Home", href: "/", icon: <Plane className="w-4 h-4" /> },
    { name: "Destinations", href: "/destinations", icon: <Globe className="w-4 h-4" /> },
    { name: "Create Trip", href: "/create-trip", icon: <Plus className="w-4 h-4" />, protected: true },
    { name: "My Journeys", href: "/my-trips", icon: <Map className="w-4 h-4" />, protected: true },
    { name: "About Us", href: "/about", icon: <Info className="w-4 h-4" /> },
    { name: "Meet the Developer", href: "https://www.anjulrathor.com", icon: <ExternalLink className="w-4 h-4" />, external: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 px-4" : "py-5 px-6"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
              <Plane className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Trip<span className="text-primary">Gen</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noopener noreferrer" : ""}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 p-1 pl-3 rounded-full border border-border bg-white dark:bg-black/40 hover:border-primary/50 transition-all"
                >
                  <span className="text-xs font-medium hidden sm:block">{user.displayName?.split(" ")[0]}</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                    <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-neutral-900 border border-border rounded-2xl shadow-2xl p-2 z-[60] overflow-hidden"
                    >
                      {/* ... menu content remains same ... */}
                      <div className="px-3 py-3 border-b border-border/50">
                        <p className="text-sm font-bold truncate">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/create-trip"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary-foreground rounded-xl transition-all"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Plus className="w-4 h-4" /> Create Trip
                        </Link>
                        <Link
                          href="/my-trips"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary-foreground rounded-xl transition-all"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Map className="w-4 h-4" /> My Trips
                        </Link>
                      </div>
                      <div className="pt-1 border-t border-border/50">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            {/* Mobile Toggle / Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-secondary/80 dark:bg-neutral-800 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-4 top-24 z-50 lg:hidden"
          >
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  if (link.protected && !user) return null;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      target={link.external ? "_blank" : "_self"}
                      rel={link.external ? "noopener noreferrer" : ""}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        {link.icon}
                      </div>
                      {link.name}
                    </Link>
                  );
                })}
                
                <div className="h-px bg-border/50 my-4" />

                {!user ? (
                   <Link
                   href="/login"
                   className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   <LogIn className="w-5 h-5" /> Sign In Now
                 </Link>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="text-sm font-black">{user.displayName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Logged In</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-black border border-red-500/20"
                    >
                        <LogOut className="w-5 h-5" /> Logout Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
