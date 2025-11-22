// app/api/generate/route.js
import { NextResponse } from "next/server";

/**
 * Server route that calls Google Generative AI via the @google/generative-ai SDK.
 *
 * Requirements:
 * - You installed: npm install @google/generative-ai
 * - Set env vars in Vercel and locally:
 *     GEMINI_API_KEY  (your API key)
 *     GEMINI_MODEL    (e.g. "gemini-1.5-mini" or another available model)
 *
 * If you get any error, copy the exact server response or Vercel logs and paste here.
 */

export async function POST(req) {
  try {
    const body = await req.json();
    const { formId, payload } = body || {};

    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-1.5-mini";

    if (!key) {
      return NextResponse.json({ error: "Server not configured: missing GEMINI_API_KEY" }, { status: 500 });
    }

    // Build a plain prompt from the payload
    const prompt = `Create a concise trip itinerary for ${payload.destination?.label || "the destination"}.
Days: ${payload.days || "N/A"}
Budget: ${payload.budget || "N/A"}
Adventure: ${payload.adventure || "N/A"}
Notes: ${payload.notes || ""}

Return:
- Short intro
- Day-by-day plan
- 3 hotel suggestions (name + one-line note)
- 5 top things to do

Keep it short and human-readable.`;

    // --------------------------
    // Use the lightweight REST-compatible SDK call.
    // We will call the REST-style endpoint with x-goog-api-key header.
    // This approach is compatible with the free-tier / studio API behavior.
    // --------------------------
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // For Google generative API, the API key is provided this way
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        // This body shape works for many Studio endpoints; if your model needs a different field, we'll adjust.
        prompt: {
          text: prompt
        },
        // tuning options (optional)
        maxOutputTokens: 800
      }),
    });

    // If the call itself failed (non-2xx), capture the message
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `AI server responded with ${res.status}`, details: errText }, { status: 502 });
    }

    const data = await res.json();

    // Try to extract the human text from common response shapes
    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || // common candidate shape
      data?.output?.[0]?.content?.text ||               // alternative shape
      data?.text ||                                     // fallback
      JSON.stringify(data);

    return NextResponse.json({ aiResponse });
  } catch (err) {
    console.error("API /api/generate error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
