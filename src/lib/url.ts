/**
 * Guards against open redirects. Only same-origin absolute paths are allowed.
 * Returns null for anything else (absolute URLs, protocol-relative, etc.).
 */
export function safeNext(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("\\")) return null;
  return value;
}
