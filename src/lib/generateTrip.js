"use client";

import { askGemini } from "@/lib/gemini";
import { buildTripPrompt } from "@/lib/buildPrompt";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function generateTripAI(form) {
  const user = auth.currentUser;

  if (!user) throw new Error("User not logged in");

  // 1️⃣ Build the prompt
  const prompt = buildTripPrompt(form);

  // 2️⃣ Ask Gemini
  const aiResponse = await askGemini(prompt);

  // 3️⃣ Save generated trip to Firestore
  const ref = collection(db, `users/${user.uid}/generatedTrips`);

  const saved = await addDoc(ref, {
    ...form,
    aiResponse,
    createdAt: serverTimestamp(),
  });

  // 4️⃣ Return both ID + content
  return {
    id: saved.id,
    aiResponse
  };
}
