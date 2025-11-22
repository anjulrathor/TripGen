// app/api/generate/route.js
import { NextResponse } from "next/server";

// Force Node.js runtime to see env logs clearly
export const runtime = "nodejs";

/**
 * TripGen AI Route (server-side)
 *
 * Env:
 *  GEMINI_API_KEY=xxxx
 *  GEMINI_MODEL=gemini-1.5-flash
 */

export async function POST(req) {
  try {
    const body = await req.json();
    const { formId, payload } = body || {};

    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    // 🔎 DEBUG LOGS — check env variables
    console.log("🔑 API KEY LOADED:", process.env.GEMINI_API_KEY);
    console.log("🔧 MODEL LOADED:", process.env.GEMINI_MODEL);

    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    if (!key) {
      console.log("❌ ERROR: GEMINI_API_KEY is missing in environment!");
      return NextResponse.json(
        { error: "Server not configured: missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // Build AI prompt content
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

    // Google Generative API v1 endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(key)}`;

    console.log("🌐 Calling Gemini API at:", endpoint);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      console.log("❌ Gemini API error:", text);
      return NextResponse.json(
        {
          error: `AI server responded with ${res.status}`,
          details: text,
        },
        { status: 502 }
      );
    }

    const data = JSON.parse(text);

    // Extract best possible response
    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0] ||
      (Array.isArray(data?.candidates?.[0]?.content) &&
        (data.candidates[0].content[0]?.parts?.[0]?.text ??
          data.candidates[0].content[0]?.text)) ||
      JSON.stringify(data);

    console.log("✅ AI RESPONSE RECEIVED");

    return NextResponse.json({ aiResponse, raw: data });

  } catch (err) {
    console.error("API /api/generate error:", err);
    return NextResponse.json(
      { error: err?.message || "Server error", stack: err?.stack },
      { status: 500 }
    );
  }
}
