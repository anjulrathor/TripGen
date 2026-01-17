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
      image: "https://images.pexels.com/photos/457881/pexels-photo-457881.jpeg",
      title: "Explore the Blue",
      subtitle: "Discover hidden beaches and serene coastal escapes.",
    },
    {
      image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
      title: "Mountain Peaks",
      subtitle: "Breathing the fresh air of the majestic Himalayas.",
    },
    {
      image: "https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg",
      title: "Forest Retreat",
      subtitle: "Reconnect with nature in lush, green sanctuaries.",
    },
    {
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 lg:py-28">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left w-full max-w-3xl mx-auto lg:mx-0 flex flex-col items-center lg:items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3 fill-current text-primary" /> Next-Gen Travel Planning
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-foreground text-balance">
              Travel Planning <br className="hidden md:block" />
              <span className="text-primary italic">Simplified.</span>
            </h1>
            
            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Meet TripGen—your digital architect for unforgettable journeys. We use AI to craft human-centric, day-by-day itineraries tailored to your soul.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <Link
                href="/create-trip"
                className="w-full sm:w-auto group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300"
              >
                Plan My Dream Trip
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/destinations"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-border bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm text-foreground font-black hover:bg-secondary transition-all flex justify-center items-center shadow-sm"
              >
                Explore More
              </Link>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-background bg-secondary flex items-center justify-center overflow-hidden shadow-md">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-black text-foreground">Joined by 10k+ Travelers</p>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-primary">
                  {[1, 2, 3, 4, 5].map((s) => <Heart key={s} className="w-3 h-3 fill-current" />)}
                  <span className="text-[10px] text-muted-foreground ml-1 font-bold">TOP RATED AI SERVICE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Swiper Hero Carousel (HIDDEN ON MOBILE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative h-[600px] w-full"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-12">
                      <motion.h3 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="text-4xl font-black text-white mb-2"
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

            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 glass p-4 rounded-3xl animate-float z-20 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-primary">Safe Travels</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap font-bold">Verified Guides</p>
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
