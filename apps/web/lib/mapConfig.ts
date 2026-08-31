export const MAP_STYLE = "https://demotiles.maplibre.org/style.json";
export const DEFAULT_CENTER: [number, number] = [80.2785, 20.5937];
export const DEFAULT_ZOOM = 4.5;

export function getSuitabilityColor(score: number): string {
  if (score >= 75) return "#0ea5e9";
  if (score >= 50) return "#f97316";
  if (score >= 25) return "#dc2626";
  return "#7c3aed";
}

export function getSuitabilityLabel(score: number): string {
  if (score >= 75) return "SAFE";
  if (score >= 50) return "CAUTION";
  if (score >= 25) return "DANGER";
  return "CRITICAL";
}
