// lib/gemini.js (FIXED)
// NEVER call Gemini directly from frontend.
// ALWAYS call your server route /api/generate.

"use client";

export async function askGemini(prompt) {
  // Build minimal payload for server route
  const payload = {
    destination: { label: "Custom Prompt" },
    days: 1,
    budget: "moderate",
    adventure: "solo",
    notes: prompt,
  };

  // Call your backend API route safely
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });

  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error("Invalid response from server");
  }

  if (!res.ok) {
    throw new Error(json?.error || "Failed to generate AI response");
  }

  return json.aiResponse;
}
