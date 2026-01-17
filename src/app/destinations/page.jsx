"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, Search, Star, Camera, Compass } from "lucide-react";
import Link from "next/link";

const DestinationCard = ({ city, country, image, rating, type }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-border shadow-sm overflow-hidden"
  >
    <div className="h-64 overflow-hidden">
      <img src={image} alt={city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 shadow-sm text-[10px] font-black uppercase tracking-wider text-foreground">
            {type}
        </span>
    </div>
    <div className="p-8">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl font-black text-foreground">{city}</h3>
        <div className="flex items-center gap-1 text-primary">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold text-foreground">{rating}</span>
        </div>
      </div>
      <p className="flex items-center gap-2 text-muted-foreground font-medium mb-6">
        <MapPin className="w-4 h-4 text-primary" /> {country}
      </p>
      <Link href="/create-trip" className="w-full flex items-center justify-center gap-2 py-4 bg-secondary group-hover:bg-primary text-foreground group-hover:text-primary-foreground font-bold rounded-2xl transition-all">
        Plan a trip here
      </Link>
    </div>
  </motion.div>
);

export default function DestinationsPage() {
  const destinations = [
    { city: "Kyoto", country: "Japan", image: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg", rating: 4.9, type: "Cultural" },
    { city: "Santorini", country: "Greece", image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg", rating: 4.8, type: "Romantic" },
    { city: "Bali", country: "Indonesia", image: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg", rating: 4.7, type: "Tropical" },
    { city: "Amalfi Coast", country: "Italy", image: "https://images.pexels.com/photos/3563914/pexels-photo-3563914.jpeg", rating: 4.9, type: "Scenic" },
    { city: "Reykjavik", country: "Iceland", image: "https://images.pexels.com/photos/1009136/pexels-photo-1009136.jpeg", rating: 4.8, type: "Adventure" },
    { city: "Marrakesh", country: "Morocco", image: "https://images.pexels.com/photos/2261165/pexels-photo-2261165.jpeg", rating: 4.7, type: "Exotic" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-xs font-bold uppercase mb-4">
            <Compass className="w-3 h-3" /> Explore the World
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground mb-4">Trending <span className="text-primary italic">Destinations</span></h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Hand-picked escapes curated by our AI engine and the global traveler community.
          </p>
        </div>

        {/* Search & Filter - UI Only */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
            <div className="relative group w-full max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Where to next?" 
                    className="w-full pl-14 pr-8 py-5 rounded-[2rem] bg-white dark:bg-neutral-900 border border-border outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {["Beach", "City", "Mountains", "Nature", "Luxury"].map(cat => (
                    <button key={cat} className="whitespace-nowrap px-6 py-5 rounded-[2rem] border border-border bg-white dark:bg-neutral-900 font-bold hover:border-primary hover:text-primary transition-all">
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <DestinationCard key={i} {...dest} />
          ))}
        </div>

      </div>
    </main>
  );
}
