"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Users, Shield, Sparkles, Heart, Rocket, Mail, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Happy Travelers", value: "50k+" },
    { label: "Trips Generated", value: "1.2M" },
    { label: "Destinations", value: "190+" },
    { label: "Community Rating", value: "4.9/5" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center mb-24">
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center lg:text-left"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-xs font-bold uppercase mb-6">
                    <Rocket className="w-3 h-3" /> Our Mission
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground mb-8 leading-tight">
                    We're Redefining <br className="hidden sm:block" />
                    <span className="text-primary italic">How You Travel.</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                    TripGen was born from a simple idea: travel planning should be as exciting as the trip itself. We combine cutting-edge AI with a human touch to create itineraries that breathe.
                </p>
                <div className="grid grid-cols-2 gap-6 sm:gap-8 max-w-sm mx-auto lg:mx-0">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <h3 className="text-3xl md:text-4xl font-black text-foreground">{stat.value}</h3>
                            <p className="text-muted-foreground font-bold mt-1 uppercase tracking-wider text-[10px]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 mx-auto w-full lg:w-auto"
            >
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Our Team" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 md:p-12">
                     <p className="text-white text-lg md:text-xl font-bold italic">"Travel is the only thing you buy that makes you richer."</p>
                </div>
            </motion.div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
            {[
                { icon: Sparkles, title: "AI Precision", desc: "Our algorithms learn from millions of successful trips to predict what you'll love." },
                { icon: Users, title: "Human Centric", desc: "Technology serves people, not the other way around. Every plan is built for comfort." },
                { icon: Shield, title: "Verified Safety", desc: "We prioritize routes and destinations that are rated safe by global travel standards." }
            ].map((v, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] border border-border hover:border-primary transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-6">
                        <v.icon className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-black text-foreground mb-4">{v.title}</h4>
                    <p className="text-muted-foreground leading-relaxed font-medium">{v.desc}</p>
                </div>
            ))}
        </div>

        {/* Developer CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">Built with ❤️ for the world.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12 font-medium">
                TripGen is an open-vision project. If you're a developer or a traveler with an idea, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
                <a href="https://www.anjulrathor.com" target="_blank" className="px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Visit Developer Site
                </a>
                <div className="flex gap-4">
                    <a href="#" className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-all">
                        <Github className="w-6 h-6" />
                    </a>
                    <a href="#" className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-all">
                        <Twitter className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}
