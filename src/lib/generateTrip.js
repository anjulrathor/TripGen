// lib/generateTrip.js
"use client";

import { askGemini } from "@/lib/gemini";
import { buildTripPrompt } from "@/lib/buildPrompt";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/** Helper: remove keys with undefined (Firestore rejects undefined) */
function removeUndefined(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const out = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    // recursively clean nested objects
    out[k] = (v && typeof v === "object") ? removeUndefined(v) : v;
  }
  return out;
}

/** Normalize destination.value: coerce coordinates to numbers and keep safe shape */
function normalizeDestination(destination) {
  if (!destination) return null;

  const value = destination.value || {};

  // Accept multiple possible field names
  const latRaw = value.lat ?? value.latitude ?? null;
  const lonRaw = value.lon ?? value.lng ?? value.longitude ?? null;

  const lat = latRaw !== null && latRaw !== undefined ? Number(latRaw) : undefined;
  const lon = lonRaw !== null && lonRaw !== undefined ? Number(lonRaw) : undefined;
  const lng = lon; // alias

  // Build cleaned value (don't include undefined fields)
  const cleanedValue = removeUndefined({
    ...value,
    ...(lat !== undefined ? { lat } : {}),
    ...(lon !== undefined ? { lon } : {}),
    ...(lng !== undefined ? { lng } : {}),
  });

  // Build cleaned destination object
  const cleanedDestination = removeUndefined({
    ...destination,
    value: cleanedValue,
  });

  return cleanedDestination;
}

export async function generateTripAI(form) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  if (!form) throw new Error("generateTripAI: missing form payload");

  // Defensive normalization
  const normalizedDestination = normalizeDestination(form.destination);
  if (!normalizedDestination) {
    throw new Error("generateTripAI: destination missing or invalid");
  }

  const normalizedForm = removeUndefined({
    ...form,
    destination: normalizedDestination,
  });

  // Debug: show what will be used/saved (remove in production if verbose)
  console.debug("generateTripAI: normalizedForm (to be used):", normalizedForm);

  // 1) Build the prompt with normalized form
  const prompt = buildTripPrompt(normalizedForm);

  // 2) Ask Gemini (may throw)
  const aiResponse = await askGemini(prompt, normalizedForm);

  // 3) Save generated trip to Firestore (save sanitized object)
  const ref = collection(db, `users/${user.uid}/generatedTrips`);

  const saved = await addDoc(ref, {
    ...normalizedForm,
    aiResponse,
    createdAt: serverTimestamp(),
  });

  return {
    id: saved.id,
    aiResponse,
  };
}
