"use client";

/**
 * Communicates with the backend /api/generate route.
 * @param {string} prompt - The full prompt built by buildTripPrompt.
 * @param {object} payload - The original form data for context.
 */
export async function askGemini(prompt, originalForm = {}) {
  // We send the full form data to the server so it has clean context
  // The 'prompt' is passed as the primary instruction source.
  const payload = {
    destination: originalForm.destination || { label: "Unknown" },
    days: originalForm.days || 1,
    budget: originalForm.budget || "moderate",
    adventure: originalForm.adventure || "solo",
    notes: prompt, // The actual prompt becomes the 'notes' or secondary input
  };

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });

  let json;
  try {
    const text = await res.text();
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error("Server returned non-JSON:", text);
      throw new Error("Server responded with an invalid format.");
    }
  } catch (e) {
    throw new Error(e.message || "Failed to contact AI server.");
  }

  if (!res.ok) {
    throw new Error(json?.error || "Failed to generate AI response.");
  }

  return json.aiResponse;
}
