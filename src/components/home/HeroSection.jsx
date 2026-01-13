"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Plane, Map, Calendar, Users, ArrowRight, Shield, Zap, Heart } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroSection = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      title: "Explore the Blue",
      subtitle: "Discover hidden beaches and serene coastal escapes.",
    },
    {
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      title: "Mountain Peaks",
      subtitle: "Breathing the fresh air of the majestic Himalayas.",
    },
    {
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      title: "Forest Retreat",
      subtitle: "Reconnect with nature in lush, green sanctuaries.",
    },
    {
      image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c4a",
      title: "Golden Hour",
      subtitle: "Experience the world in its most beautiful light.",
    },
  ];

  const tripTypes = [
    { icon: "🏙️", title: "City Explorer", desc: "1-2 days quick urban trips.", color: "bg-blue-100 text-blue-600" },
    { icon: "🌄", title: "Nature Getaway", desc: "Peaceful hill and lake escapes.", color: "bg-green-100 text-green-600" },
    { icon: "🍽️", title: "Food Journey", desc: "For the street food hunters.", color: "bg-orange-100 text-orange-600" },
    { icon: "🕍", title: "Heritage", desc: "Monuments and culture.", color: "bg-amber-100 text-amber-600" },
    { icon: "🏖️", title: "Relaxation", desc: "Lush resorts and beaches.", color: "bg-cyan-100 text-cyan-600" },
    { icon: "🎢", title: "Adventure", desc: "Theme parks and thrill.", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="pt-24 overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3 fill-current" /> Next-Gen Travel Planning
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-foreground text-balance">
              Travel Planning <br />
              <span className="text-primary italic">Simplified.</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-xl">
              Meet TripGen—your digital architect for unforgettable journeys. We use AI to craft human-centric, day-by-day itineraries tailored to your soul.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/create-trip"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                Plan My Dream Trip
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/destinations"
                className="px-8 py-4 rounded-2xl border-2 border-border text-foreground font-bold hover:bg-secondary transition-all"
              >
                Explore More
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-secondary flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold">Joined by 10k+ Travelers</p>
                <div className="flex items-center gap-1 text-primary">
                  {[1, 2, 3, 4, 5].map((s) => <Heart key={s} className="w-3 h-3 fill-current" />)}
                  <span className="text-xs text-muted-foreground ml-1">4.9/5 satisfaction rate</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Swiper Hero Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl -z-10 animate-pulse"></div>
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="w-full h-full rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-white/10 overflow-hidden"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
                      <motion.h3 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="text-4xl font-bold text-white mb-2"
                      >
                        {slide.title}
                      </motion.h3>
                      <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg"
                      >
                        {slide.subtitle}
                      </motion.p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl animate-float z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-primary">Safe Travels</p>
                  <p className="text-[10px] text-muted-foreground">Certified AI Guides</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES / TRIP TYPES CAROUSEL ===== */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground">
                Tailored for your <span className="text-primary underline underline-offset-8">Travel Style</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">Swipe through our most popular trip modalities.</p>
            </div>
            <div className="flex gap-2">
                <button className="swiper-prev-btn p-3 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition-all">
                    <ArrowRight className="w-6 h-6 rotate-180" />
                </button>
                <button className="swiper-next-btn p-3 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition-all">
                    <ArrowRight className="w-6 h-6" />
                </button>
            </div>
          </div>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            navigation={{
                nextEl: '.swiper-next-btn',
                prevEl: '.swiper-prev-btn',
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            loop={true}
            className="pb-10"
          >
            {tripTypes.map((trip, index) => (
              <SwiperSlide key={index}>
                <div className="group h-full bg-white dark:bg-neutral-900 p-8 rounded-[2rem] border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                  <div className={`w-16 h-16 ${trip.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                    {trip.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {trip.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {trip.desc}
                  </p>
                  <Link href="/about" className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between group/btn">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover/btn:text-primary">Learn more</span>
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===== INFO SECTION ===== */}
      <section id="learn" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12">
            {[
                { icon: <Map className="w-8 h-8"/>, title: "Smart Mapping", desc: "Our AI calculates the most efficient routes between your favorite spots.", href: "/create-trip" },
                { icon: <Calendar className="w-8 h-8"/>, title: "Dynamic Schedule", desc: "Life happens. Easily adjust your itinerary on the fly with real-time updates.", href: "/create-trip" },
                { icon: <Users className="w-8 h-8"/>, title: "Group Sync", desc: "Coordinate with your friends and family with seamless trip sharing.", href: "/login" }
            ].map((feature, i) => (
                <Link href={feature.href} key={i} className="flex flex-col gap-4 group cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {feature.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{feature.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
