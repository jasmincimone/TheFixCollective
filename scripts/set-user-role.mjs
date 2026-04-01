/**
 * Usage (from repo root):
 *   node scripts/set-user-role.mjs thefixurbanroots@gmail.com CUSTOMER
 *
 * Loads DATABASE_URL from .env.local, .env, or prisma/.env (first match).
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  for (const f of [".env.local", ".env", "prisma/.env"]) {
    const p = resolve(process.cwd(), f);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const m = t.match(/^DATABASE_URL=(.+)$/);
      if (m) return m[1].replace(/^["']|["']$/g, "").trim();
    }
  }
  return "file:./dev.db";
}

const ALLOWED = new Set(["ADMIN", "VENDOR", "CUSTOMER"]);

const emailArg = process.argv[2];
const role = (process.argv[3] ?? "CUSTOMER").toUpperCase();

if (!emailArg?.trim()) {
  console.error("Usage: node scripts/set-user-role.mjs <email> [role]");
  console.error("role: ADMIN | VENDOR | CUSTOMER");
  process.exit(1);
}

if (!ALLOWED.has(role)) {
  console.error(`Invalid role "${role}". Use: ADMIN, VENDOR, or CUSTOMER`);
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: loadDatabaseUrl() } },
});

try {
  const email = emailArg.trim();
  const rows = await prisma.$queryRaw`
    SELECT id, email, role FROM User WHERE lower(email) = lower(${email})
  `;
  if (!rows?.length) {
    const any = await prisma.user.findMany({ select: { email: true, role: true }, take: 30 });
    console.error(`No user found with email matching "${email}" (case-insensitive).`);
    if (any.length) console.error("Users in DB:", any);
    else console.error("User table is empty for this database.");
    process.exit(1);
  }
  const row = rows[0];
  await prisma.user.update({
    where: { id: row.id },
    data: { role },
  });
  console.log(`Updated ${row.email}: ${row.role} → ${role}`);
} finally {
  await prisma.$disconnect();
}
