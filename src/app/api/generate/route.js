import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { formId, payload } = body;

    if (!formId || !payload) {
      return NextResponse.json({ error: "Missing formId or payload" }, { status: 400 });
    }

    const GEMINI_KEY = process.env.GEMINI_KEY;
    const GEMINI_ENDPOINT = process.env.GEMINI_ENDPOINT;

    if (!GEMINI_KEY || !GEMINI_ENDPOINT) {
      return NextResponse.json(
        { error: "Missing GEMINI_KEY or GEMINI_ENDPOINT" },
        { status: 500 }
      );
    }

    // Build prompt
    const prompt = `Create a trip plan for ${payload.destination?.label}.
Days: ${payload.days}
Budget: ${payload.budget}
Adventure: ${payload.adventure}
Notes: ${payload.notes}
Return a small trip plan.`;

    // Call Gemini
    const aiRes = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_KEY}`,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }),
    });

    const data = await aiRes.json();

    // Parse response
    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      JSON.stringify(data);

    return NextResponse.json({ aiResponse });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
