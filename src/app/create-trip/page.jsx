"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Protected from "@/components/Protected";

/**
 * Free Nominatim Autocomplete Component
 */
function FreePlacesAutocomplete({ value = null, onChange = () => {}, placeholder = "Search your destination…" }) {
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  const debounceRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (value?.label) setQuery(value.label);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=6&addressdetails=0`;

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
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }, 300);
  }, [query]);

  function select(item) {
    setQuery(item.label);
    setResults([]);
    setOpen(false);
    onChange(item);
  }

  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/60 border rounded-xl shadow-sm outline-none"
      />

      {open && (
        <ul className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-xl border max-h-60 overflow-auto">
          {results.map((r) => (
            <li
              key={r.value.place_id}
              onMouseDown={() => select(r)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50"
            >
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white/60 backdrop-blur-md border rounded-2xl p-6 shadow-xl">
      {children}
    </div>
  );
}

export default function CreateTripPage() {
  const router = useRouter();
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState("moderate");
  const [adventure, setAdventure] = useState("solo");
  const [notes, setNotes] = useState("");

  /**
   * MAIN FUNCTION — SAVE → CALL GEMINI → SAVE AI → REDIRECT
   */
  async function handleGenerate() {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login first");
        return;
      }

      const payload = {
        destination: destinationPlace,
        days: Number(days),
        budget,
        adventure,
        notes,
        createdAt: new Date().toISOString(),
      };

      // 1) Create pending generated trip
      const genRef = await addDoc(
        collection(db, `users/${user.uid}/generatedTrips`),
        {
          status: "pending",
          payload,
          createdAt: serverTimestamp(),
        }
      );

      const genId = genRef.id;

      // 2) Call serverless API
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: genId, payload }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error(json);
        await setDoc(
          doc(db, `users/${user.uid}/generatedTrips/${genId}`),
          {
            status: "error",
            error: json.error || "AI failed",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        alert("Generation failed");
        return;
      }

      // 3) Save AI text
      await setDoc(
        doc(db, `users/${user.uid}/generatedTrips/${genId}`),
        {
          aiResponse: json.aiResponse,
          status: "done",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 4) Redirect
      router.push(`/trip/${genId}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <Protected>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-8">Create Your Trip</h1>

          <Card>
            <div className="grid gap-6">

              {/* Destination */}
              <div>
                <label className="text-sm font-semibold">Destination</label>
                <FreePlacesAutocomplete
                  value={destinationPlace}
                  onChange={setDestinationPlace}
                />
              </div>

              {/* Days */}
              <div>
                <label className="text-sm font-semibold">Days</label>
                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="mt-2 w-full px-4 py-3 border rounded-xl bg-white/60"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-semibold">Budget</label>
                <div className="mt-2 flex gap-3">
                  {["cheap", "moderate", "luxury"].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`px-4 py-2 rounded-lg border ${
                        budget === b
                          ? "bg-indigo-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adventure */}
              <div>
                <label className="text-sm font-semibold">Adventure Type</label>
                <div className="mt-2 flex gap-3 flex-wrap">
                  {["solo", "couple", "family", "friends"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAdventure(a)}
                      className={`px-4 py-2 rounded-lg border ${
                        adventure === a
                          ? "bg-indigo-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-semibold">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 w-full px-4 py-3 min-h-[80px] rounded-lg border bg-white/60"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
              >
                Generate Trip
              </button>
            </div>
          </Card>
        </div>
      </main>
    </Protected>
  );
}
