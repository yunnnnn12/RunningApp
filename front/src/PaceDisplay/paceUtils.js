export function formatPace(secPerKm) {
  if (!secPerKm || secPerKm === Infinity) return "--:--";

  const minutes = Math.floor(secPerKm / 60);
  const seconds = Math.round(secPerKm % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")} min/km`;
}