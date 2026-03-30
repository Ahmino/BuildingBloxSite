/**
 * Display formatting utilities.
 *
 * Keep all number/currency formatting in one place so the UI
 * stays consistent and changes propagate everywhere at once.
 */

/** Format a large number with K / M suffix. */
export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/** Format dollars with commas: $123,456 */
export function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/** Signed currency string: +$42,000 or -$5,000 */
export function formatSignedCurrency(n: number): string {
  const prefix = n >= 0 ? "+" : "";
  return `${prefix}${formatCurrency(n)}`;
}

/** Generate a stable id. Uses crypto when available, falls back to Date.now. */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
