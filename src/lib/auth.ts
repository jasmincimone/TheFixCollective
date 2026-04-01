import { createHash, timingSafeEqual } from "crypto";

const SALT = process.env.NEXTAUTH_SECRET || "fix-collective-salt";

export function hashPassword(password: string): string {
  return createHash("sha256").update(SALT + password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  const h = hashPassword(password);
  if (h.length !== hash.length) return false;
  try {
    return timingSafeEqual(Buffer.from(h, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}
