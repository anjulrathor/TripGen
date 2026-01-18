"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Sparkles, Shield, Rocket, Globe, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push(redirectUrl);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router, redirectUrl]);

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // router.push handled by onAuthStateChanged listener usually, but just in case:
      // router.push(redirectUrl); 
    } catch (err) {
      console.error("Login Error:", err);
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 overflow-hidden bg-background">
      
      {/* Left side: Hero Graphics */}
      {/* Left side: Hero Graphics */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-secondary/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="p-8 rounded-[3rem] bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl">
            <div className="w-20 h-20 rounded-[1.5rem] bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-8 animate-float">
                <Plane className="w-10 h-10 text-primary-foreground fill-current" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">
               Your journey starts with a <span className="text-primary italic">single click.</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Unlock personalized itineraries, save hidden gems, and plan your dream trips with the power of artificial intelligence.
            </p>
            
            <div className="space-y-4">
                {[
                    { icon: Sparkles, text: "AI-Crafted Itineraries" },
                    { icon: Shield, text: "Seamless Coordination" },
                    { icon: Globe, text: "Global Destination Insights" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 font-bold text-white">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-foreground">
                            <item.icon className="w-5 h-5" />
                        </div>
                        {item.text}
                    </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-primary/20 blur-[50px] animate-pulse z-0"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-primary/30 blur-[60px] animate-pulse delay-700 z-0"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-12">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
        >
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <Plane className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-muted-foreground mb-12 font-medium">
            Join thousands of travelers planning their next adventures. 
          </p>

          <div className="space-y-6">
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group relative w-full h-16 rounded-2xl bg-white dark:bg-neutral-900 border-2 border-border flex items-center justify-center gap-4 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/5 active:scale-95 disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                ) : (
                    <img 
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                      alt="Google" 
                      className="w-6 h-6 group-hover:scale-110 transition-transform"
                    />
                )}
                <span className="text-lg font-bold text-foreground">
                    {loading ? "Connecting..." : "Continue with Google"}
                </span>
                
                {!loading && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                )}
            </button>

            <p className="text-xs text-muted-foreground px-6 leading-relaxed">
                By continuing, you agree to TripGen's <span className="text-foreground font-bold underline">Terms of Service</span> and <span className="text-foreground font-bold underline">Privacy Policy</span>.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-muted-foreground grayscale opacity-50">
                <Shield className="w-6 h-6" />
                <Sparkles className="w-6 h-6" />
                <Rocket className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-4">
                Secured by TripGen Auth Systems
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
