/** Normalize to E.164 if the string looks like +[country][subscriber]. */
export function normalizeE164(input: string): string | null {
  const t = input.trim().replace(/\s/g, "");
  if (!t) return null;
  if (!/^\+[1-9]\d{9,14}$/.test(t)) return null;
  return t;
}

/**
 * E.164 first; if that fails, accept common US/Canada mobile formats (10 or 11 digits).
 * Reduces "SMS never arrives" when users omit +1 or paste (555) 123-4567.
 */
export function normalizePhoneForSms(input: string): string | null {
  const strict = normalizeE164(input);
  if (strict) return strict;

  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 && /^[2-9]\d{9}$/.test(digits)) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && /^1[2-9]\d{9}$/.test(digits)) {
    return `+${digits}`;
  }
  return null;
}
