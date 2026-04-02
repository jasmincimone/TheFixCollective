import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";

const SALT = process.env.NEXTAUTH_SECRET || "fix-collective-salt";

export function hashResetToken(raw: string): string {
  return createHash("sha256").update(`${SALT}:reset:${raw}`).digest("hex");
}

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashOtpCode(code: string, challengeId: string): string {
  return createHash("sha256").update(`${SALT}:otp:${challengeId}:${code.trim()}`).digest("hex");
}

export function otpCodesEqual(storedHex: string, inputCode: string, challengeId: string): boolean {
  const a = storedHex;
  const b = hashOtpCode(inputCode, challengeId);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function generateOtpDigits(): string {
  return String(randomInt(100000, 1000000));
}

/** Strip non-digits; if longer than 6, use the last 6 (handles pasted SMS with extra text). */
export function normalizeOtpSixDigits(input: string): string {
  const d = input.replace(/\D/g, "");
  return d.length > 6 ? d.slice(-6) : d;
}
