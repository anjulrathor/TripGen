import React from "react";

const HeroSection = () => {
  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Plan your trip in seconds with AI 
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              TripGen creates simple, clean day-by-day itineraries. Just choose
              your trip type and start planning instantly.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="/create-trip"
                className="px-6 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-sky-500 text-white font-semibold shadow hover:scale-[1.03] transition"
              >
                Start Planning
              </a>

              <a
                href="#learn"
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="relative">
            <div
              className="w-full h-64 md:h-80 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')] 
                      bg-cover bg-center rounded-3xl shadow-lg"
            />
            <div className="absolute -bottom-5 left-5 bg-white shadow-md rounded-xl px-4 py-2 text-sm font-medium text-gray-700">
              ✈️ Quick weekend trips, simplified.
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRIP TYPE CARDS ===== */}
      <section id="tripOptions" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Choose your trip type
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD 1 */}
          <div className="cursor-pointer group bg-white shadow rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center text-xl mb-3">
              🏙️
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition">
              City Explorer
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Best for 1–2 day quick trips.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="cursor-pointer group bg-white shadow rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl mb-3">
              🌄
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition">
              Nature Getaway
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Hills, lakes, peaceful escapes.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="cursor-pointer group bg-white shadow rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center text-xl mb-3">
              🍽️
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-rose-600 transition">
              Food Journey
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              For food lovers & street food hunters.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="cursor-pointer group bg-white shadow rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xl mb-3">
              🕍
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition">
              History & Culture
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Museums, monuments, heritage sites.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
