"use client";
import React from "react";
import Link from "next/link";
import { Plane, Github, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                <Plane className="w-6 h-6 text-primary-foreground fill-current" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-foreground">
                Trip<span className="text-primary">Gen</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Your personal AI travel companion. We craft unique, human-centric itineraries that make every trip an unforgettable story.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-foreground font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              Product
            </h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/create-trip" className="text-muted-foreground hover:text-primary transition-colors">Create Trip</Link></li>
              <li><Link href="/my-trips" className="text-muted-foreground hover:text-primary transition-colors">My Journeys</Link></li>
              <li><Link href="/destinations" className="text-muted-foreground hover:text-primary transition-colors">Destinations</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-foreground font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              Resources
            </h3>
            <ul className="space-y-4">
              <li><Link href="https://www.anjulrathor.com" className="text-muted-foreground hover:text-primary transition-colors">Developer</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-foreground font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email</p>
                  <a href="mailto:hello@tripgen.com" className="text-foreground hover:text-primary transition-all">hello@tripgen.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</p>
                  <p className="text-foreground">Global Headquarter</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} TripGen. Built with ❤️ for travelers by <a href="https://www.anjulrathor.com" target="_blank" className="font-bold text-foreground hover:text-primary transition-colors">Anjul</a>.</p>
          <div className="flex gap-8">
            <Link href="/about" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
