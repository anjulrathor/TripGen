"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Protected from "@/components/Protected";
import { Plane, Calendar, MapPin, Trash2, Eye, Plus, Search, Archive, Briefcase } from "lucide-react";

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadTrips() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(db, `users/${user.uid}/generatedTrips`);
      const snap = await getDocs(ref);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      list.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0;
        const tb = b.createdAt?.toMillis?.() ?? 0;
        return tb - ta;
      });

      setTrips(list);
      setLoading(false);
    }

    loadTrips();
  }, []);

  async function deleteTrip(id) {
    if (!confirm("Are you sure you want to delete this trip memory?")) return;

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, `users/${user.uid}/generatedTrips/${id}`);
    await deleteDoc(ref);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  const filteredTrips = trips.filter(trip => 
    trip.destination?.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBudgetIcon = (budget) => {
    if (budget === 'cheap') return '💰';
    if (budget === 'moderate') return '💳';
    return '💎';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="font-bold text-muted-foreground animate-pulse">Gathering your memories...</p>
      </div>
    );
  }

  return (
    <Protected>
      <main className="min-h-screen pt-28 pb-20 px-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-xs font-bold uppercase mb-4">
                <Archive className="w-3 h-3" /> Your Travel Vault
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground">My <span className="text-primary italic">Journeys</span></h1>
              <p className="text-muted-foreground mt-2">Revisit your AI-crafted adventures and keep them forever.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input 
                  type="text" 
                  placeholder="Search destinations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-border outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full sm:w-64 font-medium"
                />
              </div>
              <Link href="/create-trip" className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                <Plus className="w-5 h-5" /> New Trip
              </Link>
            </div>
          </div>

          {filteredTrips.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-16 text-center border border-border shadow-xl"
            >
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No trips found</h2>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                Your travel vault is currently empty. Start by creating your first AI-powered itinerary!
              </p>
              <Link href="/create-trip" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
                Create My First Trip <Plus className="w-5 h-5" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredTrips.map((trip, index) => {
                  const rawText = (trip.aiResponse || "").replace(/[#*`]/g, "");
                  const excerpt = rawText.slice(0, 100).replace(/\s+/g, " ").trim() + (rawText.length > 100 ? "..." : "");
                  const created = trip.createdAt?.toDate ? trip.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently";
                  
                  return (
                    <motion.article
                      layout
                      key={trip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group relative bg-white dark:bg-neutral-900 rounded-[2rem] border border-border hover:border-primary transition-all duration-300 shadow-sm hover:shadow-2xl overflow-hidden"
                    >
                      {/* Card Top: Image Placeholder / Gradient */}
                      <div className="h-40 bg-secondary relative overflow-hidden">
                        <img 
                            src={`https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop&sig=${index}`} 
                            alt="Destination" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent"></div>
                        <div className="absolute top-4 left-4 flex gap-2">
                             <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 shadow-sm text-[10px] font-black uppercase tracking-wider text-foreground">
                                {created}
                             </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 pt-2">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1 pr-2">
                                {trip.destination?.label?.split(',')[0] ?? "Mystery Destination"}
                            </h2>
                            <span className="text-lg" title={trip.budget}>{getBudgetIcon(trip.budget)}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-[11px] font-bold text-muted-foreground uppercase">
                                <Calendar className="w-3 h-3" /> {trip.days} Days
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-[11px] font-bold text-muted-foreground uppercase">
                                <Briefcase className="w-3 h-3" /> {trip.adventure}
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-8">
                            {excerpt}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-6 border-t border-border/50">
                            <Link
                                href={`/trip/${trip.id}`}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold rounded-xl transition-all"
                            >
                                <Eye className="w-4 h-4" /> View Itinerary
                            </Link>

                            <button
                                onClick={() => deleteTrip(trip.id)}
                                className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                aria-label="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </Protected>
  );
}
