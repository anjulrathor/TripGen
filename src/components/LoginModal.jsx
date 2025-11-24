import React from "react";
import FocusTrap from "@/components/ui//FocusTrap";

import Button from "@/components/ui/Button";

export default function LoginModal({ open, onClose }) {
  if (!open) return null;
  function setDemo() {
    localStorage.setItem("authToken", "demo-token");
    onClose?.({ demo: true });
  }
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Login required"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60" onClick={() => onClose?.()} />
      <FocusTrap onClose={onClose}>
        <div className="relative max-w-md w-full p-6 rounded-2xl bg-[rgba(12,14,22,0.9)] border border-white/6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Sign in to continue</h2>
          <p className="text-sm text-white/70 mb-4">Create trips, save plans, and access smart recommendations.</p>
          <div className="flex gap-3">
            <Button onClick={() => (window.location.href = "/login")}>Login</Button>
            <Button gradient={false} onClick={setDemo}>Quick Demo</Button>
            <button className="ml-auto text-sm text-white/60" onClick={() => onClose?.()}>
              Cancel
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
