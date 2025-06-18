// Simple utility for anchor sanitization
export function sanitizeFirstChildText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.replace(/\s+/g, "-").toLowerCase();
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
    return value[0].replace(/\s+/g, "-").toLowerCase();
  }
  return "anchor";
}
