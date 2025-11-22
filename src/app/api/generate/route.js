// app/api/generate/route.js
import { NextResponse } from "next/server";

/**
 * TripGen AI Route
 * Uses Google Generative AI (Free-tier / Gemini API)
 *
 * Make sure you have:
 *  GEMINI_API_KEY=xxxx
 *  GEMINI_MODEL=gemini-1.5-flash-latest  (or any available model)
 */

export async function POST(req) {
  try {
    const body = await req.json();
    const { formId, payload } = body || {};

    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

    if (!key) {
      return NextResponse.json(
        { error: "Server not configured: missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // Build AI prompt content
    const prompt = `Create a short, beautiful, and useful travel itinerary.

Destination: ${payload.destination?.label || "Unknown"}
Days: ${payload.days}
Budget: ${payload.budget}
Adventure type: ${payload.adventure}
Notes: ${payload.notes}

Include in output:
- 1 paragraph introduction
- A day-by-day itinerary
- 3 hotel recommendations (no images required)
- Top 5 things to do
- No markdown, normal clean text only.
`;

    // FINAL Google Generative API endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`;

    // --------------------------
    // ✅ Correct request body format
    // --------------------------
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        {
          error: `AI server responded with ${res.status}`,
          details: errText,
        },
        { status: 502 }
      );
    }

    const data = await res.json();

    // --------------------------
    // ✅ Correct response parsing
    // --------------------------
    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      JSON.stringify(data);

    return NextResponse.json({ aiResponse });
  } catch (err) {
    console.error("API /api/generate error:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
