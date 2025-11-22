"use client";

import { db, auth } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { convertToHTML } from "@/lib/formatTripHtml";
import { motion } from "framer-motion";
import Protected from "@/components/Protected";
import Shimmer from "@/components/Shimmer";
import { useParams } from "next/navigation";

/**
 * NOTE: local uploaded file reference (for your demos)
 * /mnt/data/c0f56289-230f-401f-a74e-14bba8928f0a.png
 * (Don't rely on this path for production — place images under /public)
 */

export default function TripPage() {
  const params = useParams();            // <-- correct way in client component
  const id = params?.id || null;        // safe access

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return; // wait until id exists

    let mounted = true;
    async function loadTrip() {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        // If not logged in, Protected wrapper will redirect — but we still guard here.
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, `users/${user.uid}/generatedTrips/${id}`);
        const snap = await getDoc(ref);

        if (!mounted) return;
        if (snap.exists()) {
          setTrip(snap.data());
        } else {
          setTrip(null);
        }
      } catch (err) {
        console.error("loadTrip error", err);
        setTrip(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTrip();
    return () => { mounted = false; };
  }, [id]);

  // share helpers
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  async function handleNativeShare() {
    if (!trip) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trip to ${trip?.destination?.label || "destination"}`,
          text: `Check out this trip — ${trip?.days} days, ${trip?.budget}.`,
          url: pageUrl,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      handleCopyLink();
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

  function handleWhatsApp() {
    if (!trip) return;
    const text = encodeURIComponent(`Check out this trip to ${trip?.destination?.label || ""} — ${pageUrl}`);
    const wa = `https://api.whatsapp.com/send?text=${text}`;
    window.open(wa, "_blank");
  }

  // loading state
  if (loading) {
    return (
      <Protected>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-3xl">
            <div className="rounded-2xl p-6 bg-white/70 backdrop-blur border border-gray-200 shadow-xl">
              <div className="flex gap-4 items-center">
                <Shimmer className="w-14 h-14 rounded-md" />
                <div className="flex-1 space-y-3">
                  <Shimmer className="h-5 w-1/2 rounded-md" />
                  <Shimmer className="h-4 w-1/4 rounded-md" />
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <Shimmer className="h-6 w-32 rounded-md" />
                <Shimmer className="h-48 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Protected>
    );
  }

  // not found
  if (!trip) {
    return (
      <Protected>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Trip not found</h2>
            <p className="text-sm text-gray-500 mt-2">This trip may have been removed.</p>
          </div>
        </div>
      </Protected>
    );
  }

  // render html from AI
  const html = convertToHTML(trip.aiResponse);

  return (
    <Protected>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Trip to {trip.destination?.label}</h1>
            <p className="text-gray-600 mt-1">{trip.days} days · {trip.budget} · {trip.adventure}</p>
          </motion.div>

          <div className="flex items-center gap-3 mb-4">
            <button onClick={handleNativeShare} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700">
              Share
            </button>

            <button onClick={handleCopyLink} className="px-3 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200">
              {copied ? "Copied!" : "Copy link"}
            </button>

            <button onClick={handleWhatsApp} className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700">
              WhatsApp
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-6">
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          </motion.div>
        </div>
      </main>
    </Protected>
  );
}
