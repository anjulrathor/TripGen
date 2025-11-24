// lib/buildPrompt.js

function formatCoord(raw) {
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  if (Number.isNaN(n)) return null;
  // keep 6 decimals — enough precision for cities/points
  return Number(n.toFixed(6));
}

export function buildTripPrompt(form) {
  const destLabel =
    form.destination?.label ||
    form.destination?.value?.name ||
    form.destination?.value?.display_name ||
    form.destination?.value?.formatted_address ||
    "Unknown destination";

  const placeId = form.destination?.value?.place_id || "Unknown";

  // Defensive numeric parsing
  const latRaw = form.destination?.value?.lat ?? form.destination?.value?.latitude ?? null;
  const lonRaw = form.destination?.value?.lon ?? form.destination?.value?.lng ?? form.destination?.value?.longitude ?? null;

  const latNum = formatCoord(latRaw);
  const lonNum = formatCoord(lonRaw);

  const latDisplay = latNum !== null ? latNum : "Unknown";
  const lonDisplay = lonNum !== null ? lonNum : "Unknown";

  // extra human-readable address if available
  const displayName = form.destination?.value?.display_name || form.destination?.value?.formatted_address || "";

  return `
You are TripGen AI — a premium, highly factual travel planner.

User destination (human-readable): ${destLabel}
User-provided address / display_name: ${displayName}
Place ID: ${placeId}
Latitude: ${latDisplay}
Longitude: ${lonDisplay}

*** IMPORTANT INSTRUCTIONS FOR THIS TASK ***
1. Use the EXACT latitude and longitude provided above to identify the physical location. 
   - DO NOT replace or guess coordinates from the place name alone.
   - If Latitude or Longitude is "Unknown", explicitly say that coordinates are missing and avoid assuming a location.
2. Prefer coordinates over names for determining city/region/country.
3. If coordinates point to a specific city, neighborhood, or landmark, use that exact place as the trip focus.
4. When recommending places, attractions, and daily routes, ensure they are consistent with the coordinates' region.

Trip Details:
- Days: ${form.days ?? "Not specified"}
- Budget: ${form.budget ?? "Not specified"}
- Adventure Type: ${form.adventure ?? "General"}
- User Notes: ${form.notes ?? "None"}

Your response must include the following structured sections:

1) Short introduction to the destination (1 paragraph) — mention the city/region that matches the coordinates.
2) Best time to visit (season/months) with brief justification.
3) Top 6 attractions or must-see places (each with a 1-2 sentence description).
4) Day-by-day itinerary (${form.days ?? "N"} days) with reasonable travel times and a suggested pace for the chosen budget.
5) Where to stay — recommend neighbourhoods or areas that match the coordinates and budget.
6) Food recommendations — 3 local dishes / restaurants or types of cuisine common near the coordinates.
7) Safety and travel tips specific to the location indicated by the coordinates.
8) Short summary (2–3 lines).

Formatting rules:
- Use headings (###) for each section.
- Use bullet lists where appropriate.
- Keep language concise, factual, and engaging.
- Do not hallucinate specific addresses or businesses unless they are widely-known; when in doubt, recommend types of places (e.g., "family-friendly buffet near the Strip") instead of inventing names.

End of prompt.
  `;
}
