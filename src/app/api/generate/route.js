// app/api/generate/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const { payload } = body || {};

    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    // Defaulting to gemini-1.5-flash as it's the most stable widely available model
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    console.log("🚀 AI Generation Triggered | Model:", model);

    if (!key) {
      return NextResponse.json(
        { error: "Configuration Error: GEMINI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const prompt = `
      Act as a world-class travel planner. Create a highly detailed and engaging travel itinerary based on the following:
      
      DESTINATION: ${payload.destination?.label || "Beautiful Destination"}
      DURATION: ${payload.days || 3} Days
      BUDGET: ${payload.budget || "Moderate"}
      TRAVEL STYLE: ${payload.adventure || "Standard"}
      ADDITIONAL NOTES: ${payload.notes || "None"}

      STRICT OUTPUT FORMAT:
      1. One poetic intro paragraph about the destination.
      2. Clear daily breakdown using '## Day X' format.
      3. For each day, include:
         - A morning exploration
         - A local lunch spot type
         - An afternoon activity
         - A scenic evening experience
      4. A 'Top Recommendations' section with:
         - 3 specific neighborhoods to stay in.
         - 5 must-try local delicacies.
         - 3 transport tips.
      5. A brief conclusion.

      STYLE GUIDE:
      - Use clean Markdown.
      - Be descriptive but concise.
      - Focus on human experiences, not just checklists.
    `;

    // Using v1beta for maximum model compatibility (supports 1.5-pro, 1.5-flash, 2.0-flash experimental)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    const responseData = await upstream.json();

    if (!upstream.ok) {
      console.error("❌ Gemini API Error:", responseData);
      return NextResponse.json(
        { 
          error: responseData.error?.message || "AI Model reported an error.", 
          code: responseData.error?.code 
        },
        { status: upstream.status }
      );
    }

    const aiResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 502 });
    }

    return NextResponse.json({ aiResponse });

  } catch (err) {
    console.error("💥 Critical Failure in /api/generate:", err);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
