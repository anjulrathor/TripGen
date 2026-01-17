"use client";

import { db, auth } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { convertToHTML } from "@/lib/formatTripHtml";
import { motion, AnimatePresence } from "framer-motion";
import Protected from "@/components/Protected";
import { useParams, useRouter } from "next/navigation";
import { Plane, Calendar, Wallet, Users, Share2, Copy, Send, ArrowLeft, Download, MapPin, Star, Clock, Info, Check } from "lucide-react";

export default function TripPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id || null;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function fetchTrip(user) {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, `users/${user.uid}/generatedTrips/${id}`);
        const snap = await getDoc(ref);
        if (!mounted) return;
        if (snap.exists()) {
          setTrip(snap.data());
        } else {
          setTrip(null);
        }
      } catch (err) {
        console.error("loadTrip error", err);
        setTrip(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const unsub = auth.onAuthStateChanged((user) => {
      fetchTrip(user);
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [id]);

  function getDestinationLabel(t) {
    if (!t) return null;
    return (
      t.destination?.label ||
      (typeof t.destination === "string" ? t.destination : null) ||
      t.payload?.destination?.label ||
      (typeof t.payload?.destination === "string" ? t.payload.destination : null) ||
      null
    );
  }

  function getDays(t) { return t?.days ?? t?.payload?.days ?? "-"; }
  function getBudget(t) { return t?.budget ?? t?.payload?.budget ?? "-"; }
  function getAdventure(t) { return t?.adventure ?? t?.payload?.adventure ?? "-"; }

  function getAiResponse(t) {
    if (!t) return null;
    if (typeof t.aiResponse === "string" && t.aiResponse.trim().length > 0) return t.aiResponse;
    if (typeof t.payload?.aiResponse === "string" && t.payload.aiResponse.trim().length > 0)
      return t.payload.aiResponse;
    const raw = t.raw || t.aiRaw || t.rawResponse;
    if (raw) {
      try {
        const cand = raw?.candidates?.[0];
        const text = cand?.content?.parts?.[0]?.text || (Array.isArray(cand?.content) && cand.content[0]?.parts?.[0]?.text) || cand?.content?.parts?.[0] || null;
        if (typeof text === "string" && text.trim().length > 0) return text;
      } catch (e) {}
    }
    return null;
  }

  const destinationLabel = getDestinationLabel(trip) || "your destination";
  const days = getDays(trip);
  const budget = getBudget(trip);
  const adventure = getAdventure(trip);
  const aiText = getAiResponse(trip);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trip to ${destinationLabel}`,
          text: `Check out my AI-generated trip: ${days} days in ${destinationLabel}!`,
          url: pageUrl,
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(`Check out this trip to ${destinationLabel} — ${pageUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  }

  if (loading) {
    return (
      <Protected>
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-64 bg-secondary rounded-[2.5rem]"></div>
            <div className="h-10 w-1/2 bg-secondary rounded-xl"></div>
            <div className="h-96 bg-secondary rounded-[2.5rem]"></div>
        </div>
      </Protected>
    );
  }

  if (!trip) {
    return (
      <Protected>
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <Info className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-4">Itinerary vanished!</h2>
            <p className="text-muted-foreground mb-8">This trip may have been removed or you don't have permission to view it.</p>
            <button onClick={() => router.push('/my-trips')} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20">
                Go to My Trips
            </button>
          </div>
        </div>
      </Protected>
    );
  }

  const html = aiText ? convertToHTML(aiText) : "<p class='text-sm text-gray-500'>No itinerary available yet.</p>";

  return (
    <Protected>
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
             <img 
                 src="https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg" 
                 className="w-full h-full object-cover"
                 alt={destinationLabel}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
             
             <div className="absolute inset-0 flex flex-col justify-end max-w-5xl mx-auto px-6 pb-12">
                <motion.button 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="absolute top-28 left-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-6"
                >
                   <div className="text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                AI Generated
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground drop-shadow-sm mb-4 leading-none">
                            {destinationLabel.split(',')[0]}
                        </h1>
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm md:text-base">
                                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" /> {days} Days
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm md:text-base">
                                <Wallet className="w-4 h-4 md:w-5 md:h-5 text-primary" /> {budget}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm md:text-base">
                                <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" /> {adventure}
                            </div>
                        </div>
                   </div>

                   <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={handleNativeShare} className="flex-1 md:w-14 md:h-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all shadow-xl">
                            <Share2 className="w-6 h-6" />
                        </button>
                        <button onClick={handleWhatsApp} className="flex-1 md:w-14 md:h-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                            <Send className="w-6 h-6" />
                        </button>
                        <button onClick={handleCopyLink} className="flex-1 md:w-14 md:h-14 h-14 relative group rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                            {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                            {copied && <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded-md">Copied!</span>}
                        </button>
                   </div>
                </motion.div>
             </div>
        </section>

        {/* Itinerary Content */}
        <section className="max-w-5xl mx-auto px-6 py-12 pb-32">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 md:p-12 border border-border shadow-sm"
                    >
                        <div 
                           className="itinerary-content" 
                           dangerouslySetInnerHTML={{ __html: html }} 
                        />
                    </motion.div>
                </div>

                <aside className="space-y-8">
                    <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                             <Star className="w-5 h-5 text-primary fill-current" /> AI Highlights
                        </h3>
                        <ul className="space-y-4">
                            {["Bespoke daily flow", "Local hidden gems", "Optimized routes"].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-sm font-medium text-muted-foreground">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
      </main>
    </Protected>
  );
}
