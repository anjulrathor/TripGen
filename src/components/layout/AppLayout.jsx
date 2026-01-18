"use client";
import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  // Check if we are on the login page
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
}
