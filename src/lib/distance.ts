/** Shared presentation boundary for fixture or future calculated distances. */
export function formatDistanceKm(distanceKm?: number): string {
  return typeof distanceKm === "number" && Number.isFinite(distanceKm) && distanceKm >= 0
    ? `${distanceKm.toLocaleString("en-NZ", { maximumFractionDigits: 1 })} km`
    : "Distance unavailable";
}
