// pages/create-trip.jsx
// Reference image (local path): sandbox:/mnt/data/df20aca1-fa52-4d3e-a3f0-8f8d40a18470.png

'use client';
import React, { useEffect, useRef, useState } from "react";

/* -----------------------------------------
   FREE AUTOCOMPLETE (NOMINATIM)
   (minimal, logs selection with onChange)
------------------------------------------ */
function FreePlacesAutocomplete({ onChange = () => {}, placeholder = "Search your destination…" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const controllerRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        const q = encodeURIComponent(query);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=6`;
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

        setResults(mapped);
        setOpen(true);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Nominatim fetch error:", err);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function select(item) {
    setQuery(item.label);
    setResults([]);
    setOpen(false);
    onChange(item);
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results.length) setOpen(true); }}
        placeholder={placeholder}
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-autocomplete="list"
      />

      {open && results.length > 0 && (
        <div className="absolute z-40 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-56 overflow-auto">
          {results.map((r) => (
            <div
              key={r.value.place_id}
              onMouseDown={() => select(r)} /* onMouseDown prevents input blur before click */
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <div className="font-medium text-slate-900">{r.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -----------------------------------------
   Single-page progressive form
   Steps:
     0 -> Destination (To)
     1 -> Days + People
     2 -> Budget + Budget cards
     3 -> Traveler type cards + Create
------------------------------------------ */
export default function CreateTripPage() {
  const [step, setStep] = useState(0);

  // Form state (kept minimal)
  const [destination, setDestination] = useState(null); // object from autocomplete
  const [days, setDays] = useState(2);
  const [people, setPeople] = useState(1);
  const [budget, setBudget] = useState(3000);
  const [budgetLevel, setBudgetLevel] = useState("moderate"); // cheap | moderate | luxury
  const [travelerType, setTravelerType] = useState("solo"); // solo | couple | friends | family

  // When user selects a place, only console.log (per request)
  const handlePlaceSelect = (place) => {
    setDestination(place); // keep in state for final payload but do NOT show it on UI
    console.log("Selected place:", place);
  };

  // Move to next step (only if minimal validation passes)
  const next = () => {
    // simple validation: destination required for step 0
    if (step === 0) {
      if (!destination) {
        // minimal feedback without showing selected on UI: shake input or console.warn
        console.warn("Please choose a destination from suggestions before continuing.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Final create action -> console.log full payload
  const handleCreate = () => {
    const payload = {
      destination,
      days,
      people,
      budget,
      budgetLevel,
      travelerType,
    };
    console.log("Create Itinerary clicked — payload:", payload);
    // You can add mock generation or API call here later.
    // For now keep minimal per your request.
  };

  // Minimal step indicator (small dots) — non-intrusive
  function StepDots() {
    return (
      <div className="flex items-center gap-2 mt-6">
        {[0,1,2,3].map((i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i <= step ? "bg-cyan-600" : "bg-gray-300"}`}></div>
        ))}
      </div>
    );
  }

  return (
    <section className="sm:px-10 md:px-14 lg:px-56 xl:px-72 px-5 mt-10">
      <div>
        <h2 className="font-bold text-3xl">Tell us where are you going?</h2>
        <p className="mt-3 text-xl text-gray-500">
          TripGen will make a simple day-by-day plan. Click Next to add more details.
        </p>
      </div>

      <div className="mt-12 space-y-8">

        {/* Step 0: Destination */}
        <div className="border rounded-xl px-4 py-4">
          <h3 className="text-lg font-medium mb-3">Destination</h3>
          <FreePlacesAutocomplete
            onChange={handlePlaceSelect}
            placeholder="Search your destination…"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={next}
              className="bg-gradient-to-br from-cyan-400 to-purple-500 px-4 py-2 rounded-2xl text-black font-medium"
            >
              Next
            </button>
          </div>
        </div>

        {/* Step 1: Days + People (revealed after step >=1) */}
        {step >= 1 && (
          <div className="border rounded-xl px-4 py-4">
            <h3 className="text-lg font-medium mb-3">Trip length & travelers</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <div className="text-sm font-medium">Days</div>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value) || 1)}
                  className="mt-2 w-full px-3 py-2 border rounded"
                />
              </label>

              <label className="block">
                <div className="text-sm font-medium">People</div>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value) || 1)}
                  className="mt-2 w-full px-3 py-2 border rounded"
                />
              </label>
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={back} className="px-4 py-2 rounded-md border">Back</button>
              <button onClick={next} className="px-4 py-2 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 text-black">Next</button>
            </div>
          </div>
        )}

        {/* Step 2: Budget + Budget cards */}
        {step >= 2 && (
          <div className="border rounded-xl px-4 py-4">
            <h3 className="text-lg font-medium mb-3">Budget</h3>

            <label className="block">
              <div className="text-sm font-medium">Budget (INR)</div>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value) || 0)}
                className="mt-2 w-full px-3 py-2 border rounded"
              />
            </label>

            <div className="mt-3">
              <div className="text-sm font-medium mb-2">Budget style</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "cheap", title: "Cheap" },
                  { key: "moderate", title: "Moderate" },
                  { key: "luxury", title: "Luxury" },
                ].map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setBudgetLevel(b.key)}
                    className={`text-left p-3 rounded-xl border transition ${budgetLevel === b.key ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-gray-700 border-gray-200 hover:shadow-sm"}`}
                  >
                    <div className="font-semibold">{b.title}</div>
                    <div className="text-xs mt-1 text-gray-500">{b.key === "cheap" ? "Budget-friendly" : b.key === "moderate" ? "Comfortable" : "High-end"}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={back} className="px-4 py-2 rounded-md border">Back</button>
              <button onClick={next} className="px-4 py-2 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 text-black">Next</button>
            </div>
          </div>
        )}

        {/* Step 3: Traveler type & Create */}
        {step >= 3 && (
          <div className="border rounded-xl px-4 py-4">
            <h3 className="text-lg font-medium mb-3">Who are you traveling with?</h3>

            <div className="grid grid-cols-4 gap-3">
              {[
                { key: "solo", label: "Solo" },
                { key: "couple", label: "Couple" },
                { key: "friends", label: "Friends" },
                { key: "family", label: "Family" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTravelerType(t.key)}
                  className={`p-3 rounded-xl border text-center ${travelerType === t.key ? "bg-sky-600 text-white border-sky-600" : "bg-white text-gray-700 border-gray-200 hover:shadow-sm"}`}
                >
                  <div className="font-semibold">{t.label}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={back} className="px-4 py-2 rounded-md border">Back</button>
              <button onClick={handleCreate} className="px-4 py-2 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 text-black">Create Itinerary</button>
            </div>
          </div>
        )}

        <StepDots />
      </div>
    </section>
  );
}
