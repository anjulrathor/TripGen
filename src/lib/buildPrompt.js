export function buildTripPrompt(form) {
  const destLabel =
    form.destination?.label ||
    form.destination?.value?.name ||
    form.destination?.value?.formatted_address ||
    "Unknown destination";

  const placeId = form.destination?.value?.place_id || "Unknown";
  const lat = form.destination?.value?.lat ?? "Unknown";
  const lon = form.destination?.value?.lon ?? "Unknown";

  return `
You are TripGen AI — a premium smart travel planner.

Generate a complete travel plan based on this user input:

Destination:
${destLabel}

Location Data:
Place ID: ${placeId}
Latitude: ${lat}
Longitude: ${lon}

Trip Details:
Days: ${form.days ?? "Not specified"}
Budget: ${form.budget ?? "Not specified"}
Adventure Type: ${form.adventure ?? "General"}
User Notes: ${form.notes || "None"}

Your response must include:

### 1. A short introduction to the destination
### 2. Best time to visit
### 3. Top attractions (with small descriptions)
### 4. Day-by-day itinerary (${form.days ?? "N"} days)
### 5. Where to stay (budget matched)
### 6. Food recommendations
### 7. Safety / travel tips
### 8. A short summary

Make the content engaging, clean, and easy to read.
Use heading and bullet points.
  `;
}
