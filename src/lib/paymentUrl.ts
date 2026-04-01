const MAX_URL_LEN = 2048;

function parseOptionalHttpUrl(value: unknown, label: string): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string") {
    throw new Error(`${label} must be a string`);
  }
  const t = value.trim();
  if (t.length === 0) return null;
  if (t.length > MAX_URL_LEN) {
    throw new Error(`${label} is too long`);
  }
  let parsed: URL;
  try {
    parsed = new URL(t);
  } catch {
    throw new Error(`${label} must be a valid http or https URL`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${label} must use http or https`);
  }
  return parsed.toString();
}

/** Parse optional payment URL for create/update. Empty → null. Invalid → throw. */
export function normalizePaymentUrl(value: unknown): string | null {
  return parseOptionalHttpUrl(value, "Payment link");
}

/** Vendor website on profile. */
export function normalizeWebsiteUrl(value: unknown): string | null {
  return parseOptionalHttpUrl(value, "Website");
}

/** External product / catalog link on a listing. */
export function normalizeProductUrl(value: unknown): string | null {
  return parseOptionalHttpUrl(value, "Product link");
}

/** For PATCH: undefined = omit field, null = clear. */
export function normalizePaymentUrlPatch(
  body: Record<string, unknown>
): string | null | undefined {
  if (!("paymentUrl" in body)) return undefined;
  const v = body.paymentUrl;
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  return normalizePaymentUrl(v);
}

export function normalizeProductUrlPatch(
  body: Record<string, unknown>
): string | null | undefined {
  if (!("productUrl" in body)) return undefined;
  const v = body.productUrl;
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  return normalizeProductUrl(v);
}
