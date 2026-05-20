import "server-only";

/**
 * Demo: keep server-only secrets out of client bundles.
 * In production, use React taint APIs (experimental) when enabled in next.config.
 */
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "dev-only-not-for-client";

export function getInternalApiKey(): string {
  if (typeof window !== "undefined") {
    throw new Error("getInternalApiKey() must only run on the server");
  }
  return INTERNAL_API_KEY;
}

/** Safe metadata for logs — never log raw secrets */
export function redactSecret(value: string): string {
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}…${value.slice(-2)}`;
}
