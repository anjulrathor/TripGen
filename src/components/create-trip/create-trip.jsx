"use client";

import React, { useState, useEffect, useRef } from "react";
import AuthCheck from "../AuthCheck";
import { saveTripForm } from "@/lib/saveTrip";
import { generateTripAI } from "@/lib/generateTrip";
import { useRouter } from "next/navigation";
import Protected from "@/components/Protected";

// -------------------------------------------------------
// FREE NOMINATIM AUTOCOMPLETE (city/town/village only)
// - shows only administrative place names (city/town/village/municipality/county/state)
// - dedupes by "Name, State, Country"
// - returns numeric lat/lon/lng
// - reliably closes the dropdown on selection
// -------------------------------------------------------
function FreePlacesAutocomplete({ value = null, onChange = () => {}, placeholder = "Search your destination…" }) {
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // NEW: remember label we last selected to avoid re-searching for it
  const lastSelectedRef = useRef(null);

  useEffect(() => {
    if (value && value.label) setQuery(value.label);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // If the query equals the last selected label, it was just set by select()
    // — skip doing a search and clear the marker so typing later works normally.
    if (lastSelectedRef.current && query === lastSelectedRef.current) {
      // ensure dropdown is closed and results cleared
      setResults([]);
      setOpen(false);
      // reset marker so the next manual change will run normally
      lastSelectedRef.current = null;
      return;
    }

    if (!query || query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        const q = encodeURIComponent(query);

        // addressdetails=1 so we can inspect parsed address parts
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${q}&limit=12`;

        const res = await fetch(url, { signal: controllerRef.current.signal });
        const data = await res.json();

        // Helper: pick the best city-like name from the address object
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

          // Extract a city/town/village name (or county/state fallback)
          const cityName = extractCityName(addr);

          // Accept only if it appears to be an administrative place (not a POI/amenity/transport)
          // Nominatim returns many types; we want only administrative place entries
          const isAdministrativeType = ["city", "town", "village", "municipality", "county", "administrative"].includes(placeType);
          const isPlaceClass = classType === "place" || classType === "boundary" || classType === "admin";

          // If no cityName and not admin-like, skip (this removes monuments, metro, etc.)
          if (!cityName && !isAdministrativeType && !isPlaceClass) {
            continue;
          }

          // Compose canonical label: "City, State, Country" when available
          const statePart = addr.state ? `, ${addr.state}` : "";
          const countryPart = addr.country ? `, ${addr.country}` : "";
          const canonicalLabel = cityName ? `${cityName}${statePart}${countryPart}` : p.display_name.split(",")[0];

          // dedupe identical canonical labels
          if (seen.has(canonicalLabel)) continue;
          seen.add(canonicalLabel);

          // push cleaned result with numeric coords
          cityResults.push({
            label: canonicalLabel,
            value: {
              place_id: p.place_id,
              display_name: p.display_name,
              lat: Number(p.lat),
              lon: Number(p.lon),
              lng: Number(p.lon),
              address: addr,
              raw_type: placeType,
              raw_class: classType
            }
          });

          if (cityResults.length >= 6) break;
        }

        setResults(cityResults);
        setOpen(cityResults.length > 0);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Nominatim error:", err);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query]);

  // Close dropdown and set selection reliably
  function select(item) {
    // mark the label so the effect won't re-run a search for the same text
    lastSelectedRef.current = item.label;

    // set query to the selected label so the input shows it
    setQuery(item.label);

    // clear results and close immediately
    setResults([]);
    setOpen(false);

    // call parent onChange with the full item object
    onChange(item);

    // blur the input (optional) — this prevents accidental re-focus
    if (inputRef.current) inputRef.current.blur();
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
        <ul className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-auto">
          {results.map((r) => (
            <li
              key={r.value.place_id}
              onClick={() => select(r)}
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

// Small card wrapper
function Card({ children }) {
  return (
    <div className="bg-white/50 backdrop-blur rounded-2xl p-6 shadow-xl border border-gray-100">
      {children}
    </div>
  );
}

// Pill button
function TogglePill({ label, value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex-1 text-left px-4 py-3 rounded-lg transition border ${active ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg" : "bg-white text-gray-700 border-gray-200 hover:shadow"}`}
    >
      <div className="font-semibold">{label}</div>
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

  // -------------------------------------------------------
  // Generate Trip
  // -------------------------------------------------------
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

      // 1) Save raw form
      const formId = await saveTripForm(payload);

      // 2) Generate AI trip — FIXED (send payload ONLY)
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              TripGen — Bespoke Trip Planner
            </h1>
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

              {/* Days / Budget */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Days</label>
                  <input
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value || 0))}
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

              {/* Adventure */}
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

              {/* Generate */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95"}`}
              >
                {isLoading ? "Generating…" : "Generate Trip"}
              </button>

            </div>
          </Card>

          <AuthCheck />
        </div>
      </main>
    </Protected>
  );
}
