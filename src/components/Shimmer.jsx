"use client";
import React from "react";

/**
 * Premium reusable shimmer skeleton
 * Consistent with the new #ace456 theme
 */
export default function Shimmer({ className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-secondary/80 dark:bg-neutral-800 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"></div>
    </div>
  );
}
