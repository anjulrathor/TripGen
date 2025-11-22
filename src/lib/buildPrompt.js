export function buildTripPrompt(form) {
  return `
You are TripGen AI — a premium smart travel planner.

Generate a complete travel plan based on this user input:

Destination:
${form.destination?.label}

Location Data:
Place ID: ${form.destination?.value?.place_id}
Latitude: ${form.destination?.value?.lat}
Longitude: ${form.destination?.value?.lon}

Trip Details:
Days: ${form.days}
Budget: ${form.budget}
Adventure Type: ${form.adventure}
User Notes: ${form.notes || "None"}

Your response must include:

### 1. A short introduction to the destination
### 2. Best time to visit
### 3. Top attractions (with small descriptions)
### 4. Day-by-day itinerary (${form.days} days)
### 5. Where to stay (budget matched)
### 6. Food recommendations
### 7. Safety / travel tips
### 8. A short summary

Make the content engaging, clean, and easy to read.
Use heading and bullet points.
  `;
}
