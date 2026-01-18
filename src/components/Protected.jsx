"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter, usePathname } from "next/navigation";
import Shimmer from "./Shimmer";

export default function Protected({ children }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        // if not logged in -> redirect to login with return url
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setChecking(false);
      }
    });
    return () => unsub();
  }, [router, pathname]);

  if (checking) {
    // nice centered shimmer card
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-3xl w-full space-y-4">
          <div className="rounded-2xl p-6 bg-white/70 backdrop-blur border border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <Shimmer className="w-full h-full rounded-lg" />
              </div>
              <div className="flex-1">
                <Shimmer className="h-5 w-3/4 rounded-md" />
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <Shimmer className="h-8 rounded-md col-span-1" />
                  <Shimmer className="h-8 rounded-md col-span-2" />
                </div>
              </div>
            </div>
            <div className="mt-6"><Shimmer className="h-40 rounded-lg" /></div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
