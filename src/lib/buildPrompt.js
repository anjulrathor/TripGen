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
Specific Destination Details:
- Name: ${destLabel}
- Full Address: ${displayName}
- Coordinates: ${latDisplay}, ${lonDisplay}
- Place ID: ${placeId}

The user has explicitly requested the following notes/preferences:
${form.notes || "None"}
  `;
}
