// app/api/generate/route.js
import { NextResponse } from "next/server";

// Use Node runtime so server-side env logging works predictably
export const runtime = "nodejs";

/**
 * TripGen AI Route (server-side)
 *
 * Env required:
 *  GEMINI_API_KEY=xxxx
 *  GEMINI_MODEL=gemini-2.5-flash    (recommended default)
 *
 * Client should POST to /api/generate with JSON:
 * { formId?: string, payload: { destination, days, budget, adventure, notes } }
 *
 * Response:
 * { aiResponse: string, raw: object }
 */

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const { formId, payload } = body || {};

    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    // Safe env checks (do NOT print full key)
    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    console.log("🔎 generate route invoked; keyLoaded:", !!key, "model:", model);

    if (!key) {
      console.log("❌ GEMINI_API_KEY missing in server environment");
      return NextResponse.json(
        { error: "Server not configured: missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // Build the user-facing prompt (keep short & clear)
    const prompt = `Create a short, beautiful, and useful travel itinerary.

Destination: ${payload.destination?.label || "Unknown"}
Days: ${payload.days ?? "N/A"}
Budget: ${payload.budget ?? "N/A"}
Adventure type: ${payload.adventure ?? "N/A"}
Notes: ${payload.notes ?? ""}

Include in output:
- 1 paragraph introduction
- A day-by-day itinerary
- 3 hotel recommendations (no images required)
- Top 5 things to do
- No markdown, normal clean text only.
`;

    // Use v1 endpoint with API key attached as query param (server-side only)
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(key)}`;

    // POST to Google Generative API
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const upstreamText = await upstream.text();

    if (!upstream.ok) {
      // Return upstream error details to the client for debugging
      console.error("Gemini upstream error:", upstream.status, upstreamText);
      return NextResponse.json(
        {
          error: `AI server responded with ${upstream.status}`,
          details: upstreamText,
        },
        { status: 502 }
      );
    }

    // Parse JSON from upstream
    let data;
    try {
      data = JSON.parse(upstreamText);
    } catch (parseErr) {
      console.error("Failed to parse AI response JSON:", parseErr);
      return NextResponse.json(
        { error: "Failed to parse AI response", details: upstreamText },
        { status: 502 }
      );
    }

    // Best-effort extraction of the text from potential response shapes
    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0] ||
      (Array.isArray(data?.candidates?.[0]?.content) &&
        (data.candidates[0].content[0]?.parts?.[0]?.text ??
          data.candidates[0].content[0]?.text)) ||
      // fallback: stringify the whole parsed object
      JSON.stringify(data);

    console.log("✅ Generated AI response (length):", String(aiResponse).length);

    // Return to client; client is responsible for saving to Firestore (or you can extend server to save)
    return NextResponse.json({ aiResponse, raw: data });
  } catch (err) {
    console.error("API /api/generate exception:", err);
    return NextResponse.json(
      { error: err?.message || "Server error", stack: err?.stack },
      { status: 500 }
    );
  }
}
