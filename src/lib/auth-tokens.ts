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
