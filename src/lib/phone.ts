/** Normalize to E.164 if the string looks like +[country][subscriber]. */
export function normalizeE164(input: string): string | null {
  const t = input.trim().replace(/\s/g, "");
  if (!t) return null;
  if (!/^\+[1-9]\d{9,14}$/.test(t)) return null;
  return t;
}
