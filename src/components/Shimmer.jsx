"use client";
import React from "react";

/**
 * Simple reusable shimmer skeleton
 * Usage: <Shimmer className="h-40 w-full rounded-lg" />
 */
export default function Shimmer({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-100 ${className}`}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60"></div>
      </div>
    </div>
  );
}
