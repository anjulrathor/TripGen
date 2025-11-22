"use client";
// pages/create-trip.jsx

import React, { useState, useEffect, useRef } from "react";
import AuthCheck from "../AuthCheck";
import { saveTripForm } from "@/lib/saveTrip";
import { generateTripAI } from "@/lib/generateTrip";
import { useRouter } from "next/navigation";
import Protected from "@/components/Protected";   // ⭐ ADDED


/**
 * TripGen — Premium Form (Protected)
 * - Free Nominatim autocomplete
 * - Saves form to Firestore
 * - Generates AI itinerary with Gemini
 */

function FreePlacesAutocomplete({ value = null, onChange = () => {}, placeholder = "Search your destination…" }) {
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (value && value.label) setQuery(value.label);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setResults([]);
      setOpen(false);
      setFocusedIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        const q = encodeURIComponent(query);
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&q=${q}&limit=6`;
        const res = await fetch(url, { signal: controllerRef.current.signal });

        const data = await res.json();

        const mapped = data.map((p) => ({
          label: p.display_name,
          value: {
            place_id: p.place_id,
            display_name: p.display_name,
            lat: p.lat,
            lon: p.lon,
          },
        }));

        setResults(mapped);
        setOpen(mapped.length > 0);
        setFocusedIndex(-1);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Nominatim error:", err);
      }
    }, 300);
  }, [query]);

  function select(item) {
    setQuery(item.label);
    setResults([]);
    setOpen(false);
    setFocusedIndex(-1);
    onChange(item);
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
        <div className="text-2xl">📍</div>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-gray-500"
        />
      </div>

      {open && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-auto"
        >
          {results.map((r, i) => (
            <li
              key={r.value.place_id}
              onMouseDown={() => select(r)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50"
            >
              <div className="text-sm font-semibold text-gray-800 truncate">{r.label}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Card({ children }) {
  return <div className="bg-white/50 backdrop-blur rounded-2xl p-6 shadow-xl border border-gray-100">{children}</div>;
}

function TogglePill({ label, value, active, onClick, subtitle }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 text-left px-4 py-3 rounded-lg transition border ${
        active ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg" : "bg-white text-gray-700 border-gray-200 hover:shadow"
      }`}
    >
      <div className="font-semibold">{label}</div>
      {subtitle && <div className="text-xs mt-1 opacity-80">{subtitle}</div>}
    </button>
  );
}

export default function CreateTripPage() {
  const router = useRouter();

  const [destinationPlace, setDestinationPlace] = useState(null);
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState("moderate");
  const [adventure, setAdventure] = useState("solo");
  const [notes, setNotes] = useState("");

  // ⭐ Save + Generate + Redirect
  async function handleGenerate() {
    const payload = {
      destination: destinationPlace,
      days: Number(days),
      budget,
      adventure,
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      const formId = await saveTripForm(payload);
      console.log("🔥 Saved form ID:", formId);

      const result = await generateTripAI(payload);
      console.log("🔥 AI Trip:", result.aiResponse);

      router.push(`/trip/${result.id}`);
    } catch (error) {
      console.error("Generation error:", error);
      alert("Could not generate trip");
    }
  }

  return (
    <Protected>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto">

          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">TripGen — Bespoke Trip Planner</h1>
          </header>

          <Card>
            <div className="grid grid-cols-1 gap-6">

              {/* Destination */}
              <div>
                <label className="text-xs font-semibold text-gray-600">Destination</label>
                <div className="mt-2">
                  <FreePlacesAutocomplete value={destinationPlace} onChange={setDestinationPlace} />
                </div>
              </div>

              {/* Days + Budget */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Days</label>
                  <input
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-lg border bg-white/60"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600">Budget</label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    <TogglePill label="Cheap" value="cheap" active={budget === "cheap"} onClick={setBudget} />
                    <TogglePill label="Moderate" value="moderate" active={budget === "moderate"} onClick={setBudget} />
                    <TogglePill label="Luxury" value="luxury" active={budget === "luxury"} onClick={setBudget} />
                  </div>
                </div>
              </div>

              {/* Adventure Type */}
              <div>
                <label className="text-xs font-semibold text-gray-600">Adventure Type</label>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  <TogglePill label="Solo" value="solo" active={adventure === "solo"} onClick={setAdventure} />
                  <TogglePill label="Couple" value="couple" active={adventure === "couple"} onClick={setAdventure} />
                  <TogglePill label="Family" value="family" active={adventure === "family"} onClick={setAdventure} />
                  <TogglePill label="Friends" value="friends" active={adventure === "friends"} onClick={setAdventure} />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-gray-600">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-lg border bg-white/60 min-h-[80px] text-sm"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-95 transition"
              >
                Generate Trip
              </button>

            </div>
          </Card>

          <AuthCheck />
        </div>
      </main>
    </Protected>
  );
}
