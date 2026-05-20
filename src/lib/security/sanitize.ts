/**
 * Strip control characters and trim user-controlled strings before validation/storage.
 */
export function sanitizeString(input: unknown, maxLength = 10_000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(input: unknown): string {
  return sanitizeString(input, 254).toLowerCase();
}
