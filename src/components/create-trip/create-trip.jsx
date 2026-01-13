"use client";

import React, { useState, useEffect, useRef } from "react";
import { saveTripForm } from "@/lib/saveTrip";
import { generateTripAI } from "@/lib/generateTrip";
import { useRouter } from "next/navigation";
import Protected from "@/components/Protected";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Wallet, Users, Info, Sparkles, Navigation, Check, Loader2, Plane, Heart } from "lucide-react";

// -------------------------------------------------------
// FREE NOMINATIM AUTOCOMPLETE (city/town/village only)
// -------------------------------------------------------
function FreePlacesAutocomplete({ value = null, onChange = () => {}, placeholder = "Where do you want to go?" }) {
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const lastSelectedRef = useRef(null);

  useEffect(() => {
    if (value && value.label) setQuery(value.label);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (lastSelectedRef.current && query === lastSelectedRef.current) {
      setResults([]);
      setOpen(false);
      lastSelectedRef.current = null;
      return;
    }

    if (!query || query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        const q = encodeURIComponent(query);
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${q}&limit=6`;

        const res = await fetch(url, { signal: controllerRef.current.signal });
        const data = await res.json();

        const extractCityName = (addr) => {
          if (!addr) return null;
          const keys = ["city", "town", "village", "municipality", "county", "state"];
          for (const k of keys) {
            if (addr[k]) return addr[k];
          }
          return null;
        };

        const seen = new Set();
        const cityResults = [];

        for (const p of data) {
          const addr = p.address || {};
          const placeType = (p.type || "").toLowerCase();
          const classType = (p.class || "").toLowerCase();
          const cityName = extractCityName(addr);
          const isAdministrativeType = ["city", "town", "village", "municipality", "county", "administrative"].includes(placeType);
          const isPlaceClass = classType === "place" || classType === "boundary" || classType === "admin";

          if (!cityName && !isAdministrativeType && !isPlaceClass) continue;

          const statePart = addr.state ? `, ${addr.state}` : "";
          const countryPart = addr.country ? `, ${addr.country}` : "";
          const canonicalLabel = cityName ? `${cityName}${statePart}${countryPart}` : p.display_name.split(",")[0];

          if (seen.has(canonicalLabel)) continue;
          seen.add(canonicalLabel);

          cityResults.push({
            label: canonicalLabel,
            value: {
              place_id: p.place_id,
              display_name: p.display_name,
              lat: Number(p.lat),
              lon: Number(p.lon),
              lng: Number(p.lon),
              address: addr,
            }
          });
        }

        setResults(cityResults);
        setOpen(cityResults.length > 0);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Nominatim error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query]);

  function select(item) {
    lastSelectedRef.current = item.label;
    setQuery(item.label);
    setResults([]);
    setOpen(false);
    onChange(item);
    if (inputRef.current) inputRef.current.blur();
  }

  return (
    <div className="relative w-full">
      <div className={`flex items-center gap-3 transition-all duration-300 rounded-2xl px-5 py-4 ${open ? 'bg-white dark:bg-neutral-800 ring-2 ring-primary shadow-2xl' : 'bg-secondary/50 dark:bg-neutral-900/50 border border-border focus-within:ring-2 focus-within:ring-primary/50'}`}>
        <MapPin className={`w-5 h-5 ${open ? 'text-primary' : 'text-muted-foreground'}`} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-base font-medium placeholder-muted-foreground/60 w-full"
        />
        {isSearching && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {results.map((r) => (
              <li
                key={r.value.place_id}
                onClick={() => select(r)}
                className="group flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-primary/10 transition-colors border-b border-border/50 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{r.label?.split(',')[0]}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-full">{r.label}</span>
                </div>
                <Navigation className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:scale-110" />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable Option Card
function OptionCard({ icon: Icon, label, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col p-5 rounded-2xl transition-all duration-300 border-2 text-left ${active ? "bg-primary/10 border-primary shadow-lg shadow-primary/5 scale-[1.02]" : "bg-white dark:bg-neutral-900 border-border hover:border-primary/30 hover:shadow-md"}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className={`font-bold transition-colors ${active ? "text-primary" : "text-foreground"}`}>{label}</h4>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      {active && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}

// -------------------------------------------------------
// MAIN PAGE
// -------------------------------------------------------
export default function CreateTripPage() {
  const router = useRouter();

  const [destinationPlace, setDestinationPlace] = useState(null);
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState("moderate");
  const [adventure, setAdventure] = useState("solo");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!destinationPlace || !destinationPlace.label) {
        alert("Please choose a destination from the list.");
        setIsLoading(false);
        return;
      }

      const daysNum = Number(days);
      if (!daysNum || daysNum < 1) {
        alert("Please enter a valid number of days.");
        setIsLoading(false);
        return;
      }

      const payload = {
        destination: destinationPlace,
        days: daysNum,
        budget,
        adventure,
        notes,
        createdAt: new Date().toISOString()
      };

      const formId = await saveTripForm(payload);
      const result = await generateTripAI(payload);
      const redirectId = result?.id || formId;
      router.push(`/trip/${redirectId}`);
    } catch (e) {
      console.error("Generation error:", e);
      alert(e.message || "Could not generate trip.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Protected>
      <main className="min-h-screen pt-28 pb-20 px-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3 fill-current" /> AI-Powered Itineraries
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
              Create Your <span className="text-primary italic">Perfect Trip</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fill in your preferences, and let our AI architect a bespoke travel experience just for you.
            </p>
          </motion.div>

          <div className="bg-white dark:bg-neutral-900/50 backdrop-blur-2xl rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 border border-border shadow-2xl space-y-10 md:space-y-12">
            
            {/* Step 1: Destination */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">1</div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                   Destination <span className="text-muted-foreground font-medium text-sm">(City / Country)</span>
                </h3>
              </div>
              <FreePlacesAutocomplete value={destinationPlace} onChange={setDestinationPlace} />
            </motion.div>

            {/* Step 2: Duration & Budget */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">2</div>
                <h3 className="text-xl font-bold">Preferences</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Days */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" /> Trip Duration (Days)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value || 0))}
                      className="w-full bg-secondary/50 dark:bg-neutral-900/50 border border-border rounded-2xl px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Days</div>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4">
                    <Wallet className="w-4 h-4" /> Planned Budget
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <OptionCard icon={Wallet} label="Cheap" description="Budget friendly" active={budget === "cheap"} onClick={() => setBudget("cheap")} />
                      <OptionCard icon={MapPin} label="Regular" description="Value for money" active={budget === "moderate"} onClick={() => setBudget("moderate")} />
                      <OptionCard icon={Sparkles} label="Luxury" description="Premium feel" active={budget === "luxury"} onClick={() => setBudget("luxury")} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Adventure Type */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">3</div>
                <h3 className="text-xl font-bold">Travel Squad</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { id: 'solo', icon: Users, label: 'Solo', desc: 'Adventure alone' },
                    { id: 'couple', icon: Heart, label: 'Couple', desc: 'Romantic getaway' },
                    { id: 'family', icon: Users, label: 'Family', desc: 'Fun for all' },
                    { id: 'friends', icon: Users, label: 'Friends', desc: 'Shared stories' },
                ].map(item => (
                    <OptionCard key={item.id} icon={item.icon} label={item.label} description={item.desc} active={adventure === item.id} onClick={() => setAdventure(item.id)} />
                ))}
              </div>
            </motion.div>

            {/* Step 4: Notes */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">4</div>
                <h3 className="text-xl font-bold">Small Details</h3>
              </div>
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us more... (e.g. 'Love street food', 'Interested in hidden gems', 'Must see historic landmarks')"
                  className="w-full bg-secondary/50 dark:bg-neutral-900/50 border border-border rounded-[2rem] px-8 py-6 text-base font-medium outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[160px] resize-none"
                />
                <Info className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground/40" />
              </div>
            </motion.div>

            {/* Generate Button Area */}
            <div className="pt-8 border-t border-border flex flex-col items-center">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className={`relative group overflow-hidden w-full md:w-auto min-w-[300px] h-16 rounded-[1.5rem] font-bold text-lg transition-all duration-500 ${isLoading ? "bg-secondary text-muted-foreground cursor-wait" : "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1"}`}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Designing Itinerary...
                    </>
                  ) : (
                    <>
                      <Plane className="w-6 h-6 " />
                      Generate My Trip
                    </>
                  )}
                </div>
                {!isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                )}
              </button>
              <p className="text-muted-foreground text-xs mt-6 flex items-center gap-2">
                <Check className="w-3 h-3 text-primary" /> Verified by TripGen AI Engine
              </p>
            </div>
            
          </div>

        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
            {isLoading && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-white/80 dark:bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
                >
                    <div className="relative">
                         <div className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center text-primary">
                            <Plane className="w-12 h-12 fill-current animate-bounce" />
                         </div>
                    </div>
                    <h2 className="text-3xl font-black mt-10">Crafting Your Story...</h2>
                    <p className="text-muted-foreground mt-2">Our AI is exploring millions of possibilities.</p>
                </motion.div>
            )}
        </AnimatePresence>
      </main>
    </Protected>
  );
}
