"use client";
// pages/create-trip.jsx

import React, { useState, useEffect, useRef } from "react";
import AuthCheck from "../AuthCheck";
import { saveTripForm } from "@/lib/saveTrip";   // ⭐ Added Firestore save function

/**
 * TripGen — Premium Form
 * - Free Nominatim autocomplete (no paid APIs)
 * - Save only final selected place (full object)
 * - Premium UI + Firestore-ready
 */

function FreePlacesAutocomplete({ value = null, onChange = () => {}, placeholder = "Search your destination…" }) {
  const [query, setQuery] = useState(value?.label || "");
  const [place, setPlace] = useState(null);
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
        const res = await fetch(url, { signal: controllerRef.current.signal, headers: { "Accept-Language": "en" } });

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

        console.log("autocomplete results:", mapped);
        setResults(mapped);
        setOpen(Boolean(mapped.length));
        setFocusedIndex(-1);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Nominatim error", err);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    function onKey(e) {
      if (!results.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const idx = focusedIndex >= 0 ? focusedIndex : 0;
        if (results[idx]) select(results[idx]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [results, focusedIndex]);

  useEffect(() => {
    if (listRef.current && focusedIndex >= 0) {
      const node = listRef.current.children[focusedIndex];
      if (node) node.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  function select(item) {
    console.log("selected object:", item);

    setQuery(item.label);
    setPlace(item);
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
          onFocus={() => { if (results.length) setOpen(true); }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-gray-500"
        />
        <button
          onClick={() => { setQuery(""); setResults([]); setOpen(false); setFocusedIndex(-1); }}
          aria-label="clear"
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      </div>

      {open && results.length > 0 && (
        <ul
          id="places-listbox"
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-auto"
        >
          {results.map((r, i) => (
            <li
              key={r.value.place_id}
              role="option"
              aria-selected={focusedIndex === i}
              onMouseDown={(e) => { e.preventDefault(); select(r); }}
              onMouseEnter={() => setFocusedIndex(i)}
              className={`px-4 py-3 cursor-pointer transition flex flex-col gap-1 ${
                focusedIndex === i ? "bg-cyan-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="text-sm font-semibold text-gray-800 truncate">{r.label}</div>
              <div className="text-xs text-gray-400">Place ID: {r.value.place_id}</div>
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

  const [destinationPlace, setDestinationPlace] = useState(null);
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState("moderate");
  const [adventure, setAdventure] = useState("solo");
  const [notes, setNotes] = useState("");

  async function handleGenerate() {
    const payload = {
      destination: destinationPlace,
      days: Number(days) || null,
      budget,
      adventure,
      notes,
      createdAt: new Date().toISOString(),
    };

    console.groupCollapsed("%cTripGen - Payload", "color:#0ea5a4;font-weight:bold;");
    console.log(payload);
    console.groupEnd();

    try {
      const id = await saveTripForm(payload);   // ⭐ Firestore save here
      console.log("🔥 Saved Firestore doc:", id);
      alert("Trip form saved!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving trip");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">TripGen — Bespoke Trip Planner</h1>
            <p className="mt-1 text-sm text-gray-600">Refined inputs, smart autocomplete, curated prompts.</p>
          </div>
        </header>

        <Card>
          <div className="grid grid-cols-1 gap-6">

            <div>
              <label className="text-xs font-semibold text-gray-600">Destination</label>
              <div className="mt-2">
                <FreePlacesAutocomplete
                  value={destinationPlace}
                  onChange={(v) => setDestinationPlace(v)}
                />
              </div>
            </div>

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
                  <TogglePill label="Cheap" value="cheap" active={budget === "cheap"} onClick={setBudget} subtitle="Cost conscious" />
                  <TogglePill label="Moderate" value="moderate" active={budget === "moderate"} onClick={setBudget} subtitle="Balanced comfort" />
                  <TogglePill label="Luxury" value="luxury" active={budget === "luxury"} onClick={setBudget} subtitle="Best experiences" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Adventure Type</label>
              <div className="mt-3 grid grid-cols-4 gap-3">
                <TogglePill label="Solo" value="solo" active={adventure === "solo"} onClick={setAdventure} subtitle="For yourself" />
                <TogglePill label="Couple" value="couple" active={adventure === "couple"} onClick={setAdventure} subtitle="Romantic" />
                <TogglePill label="Family" value="family" active={adventure === "family"} onClick={setAdventure} subtitle="Kids friendly" />
                <TogglePill label="Friends" value="friends" active={adventure === "friends"} onClick={setAdventure} subtitle="Group fun" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-lg border bg-white/60 min-h-[80px] text-sm"
                placeholder="Any special requests…"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleGenerate}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-95 transition"
              >
                Generate Trip
              </button>
            </div>
          </div>
        </Card>

        <AuthCheck />
      </div>
    </main>
  );
}
