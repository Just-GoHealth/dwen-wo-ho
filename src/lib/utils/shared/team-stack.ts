/**
 * Deterministic (not random) stand-in for "how many other providers have
 * opened this case" — 0 for roughly a quarter of patients (no team data,
 * the card's top-left slot falls back to the NEW badge), 1-3 otherwise.
 * Stable across renders since it's hashed from the patient id. Shared
 * between `PatientGridCard` (rendering) and the dashboard sort (so sorting
 * matches exactly what's visually shown) — see
 * guide/provider-design-refactor-backend-needs.md for why this is dummy
 * data ahead of a real `assignedProviders` field.
 */
export function deriveTeamCount(patientId: string | number | null): number {
  const seed = String(patientId)
    .split("")
    .reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  return seed % 4; // 0-3; 0 means "no team data"
}
