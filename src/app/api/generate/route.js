// app/api/generate/route.js
import { NextResponse } from "next/server";

/**
 * TripGen AI Route (server-side)
 *
 * Env:
 *  GEMINI_API_KEY=xxxx
 *  GEMINI_MODEL=gemini-1.5-flash   (recommended default)
 *
 * Client should POST to /api/generate with JSON: { formId?, payload: { destination, days, budget, adventure, notes } }
 */

export async function POST(req) {
  try {
    const body = await req.json();
    const { formId, payload } = body || {};

    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    if (!key) {
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

    // Use v1 endpoint (not v1beta) and attach API key as query param
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(key)}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // This payload shape (contents -> parts -> text) matches the generative API v1 request shape.
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const text = await res.text(); // read as text first so we can show detailed errors if JSON parsing fails
    if (!res.ok) {
      // Return upstream response body to help debugging
      return NextResponse.json(
        {
          error: `AI server responded with ${res.status}`,
          details: text,
        },
        { status: 502 }
      );
    }

    // Parse JSON after successful status
    const data = JSON.parse(text);

    // Best-effort extraction of the generated text (support a few possible shapes)
    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0] ||
      // some responses put text deeper/shallow
      (Array.isArray(data?.candidates?.[0]?.content) &&
        (data.candidates[0].content[0]?.parts?.[0]?.text ??
          data.candidates[0].content[0]?.text)) ||
      // fallback to entire JSON string so caller can inspect
      JSON.stringify(data);

    return NextResponse.json({ aiResponse, raw: data });
  } catch (err) {
    console.error("API /api/generate error:", err);
    return NextResponse.json(
      { error: err?.message || "Server error", stack: err?.stack },
      { status: 500 }
    );
  }
}
