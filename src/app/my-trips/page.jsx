"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import Protected from "@/components/Protected"; // ADDED

// optional: local uploaded logo path (available in your workspace)
// /mnt/data/c0f56289-230f-401f-a74e-14bba8928f0a.png

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(db, `users/${user.uid}/generatedTrips`);
      const snap = await getDocs(ref);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // sort by createdAt desc if present
      list.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0;
        const tb = b.createdAt?.toMillis?.() ?? 0;
        return tb - ta;
      });

      setTrips(list);
      setLoading(false);
    }

    loadTrips();
  }, []);

  async function deleteTrip(id) {
    const ok = confirm("Are you sure you want to delete this trip? This cannot be undone.");
    if (!ok) return;

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, `users/${user.uid}/generatedTrips/${id}`);
    await deleteDoc(ref);

    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading your trips…
      </div>
    );
  }

  return (
    <Protected>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Your Trips</h1>
            <div className="text-sm text-gray-600">{trips.length} trips</div>
          </div>

          {trips.length === 0 ? (
            <div className="rounded-xl bg-white p-8 shadow-sm text-center">
              <p className="text-gray-700">No trips yet — create one to see it here.</p>
              <Link href="/create-trip" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow">
                Create Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.map((trip, index) => {
                const excerpt = (trip.aiResponse || "").slice(0, 160).replace(/\n+/g, " ") + (trip.aiResponse?.length > 160 ? "…" : "");
                const created = trip.createdAt?.toDate ? trip.createdAt.toDate().toLocaleString() : (trip.createdAt ?? "");
                return (
                  <motion.article
                    key={trip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="relative bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                          {trip.destination?.label ?? "Unknown Destination"}
                        </h2>

                        <div className="text-xs text-gray-500 mt-1">
                          {trip.days} days • {trip.budget} • {trip.adventure}
                        </div>

                        <p className="text-sm text-gray-700 mt-3">{excerpt}</p>

                        <div className="text-xs text-gray-400 mt-4">Saved: {created}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Link
                          href={`/trip/${trip.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow hover:bg-indigo-700"
                        >
                          View
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m0 0l4-4m-4 4l4 4M21 12h-6" />
                          </svg>
                        </Link>

                        <button
                          onClick={() => deleteTrip(trip.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 hover:bg-red-100"
                          aria-label={`Delete trip ${trip.id}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </Protected>
  );
}
