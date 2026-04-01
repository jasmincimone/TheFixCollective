import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Singleton Prisma client. After changing `prisma/schema.prisma`, run `npx prisma generate`
 * and restart the Next.js dev server so this instance picks up new models.
 *
 * Cache the client in production too (Vercel serverless): reusing the instance per warm
 * isolate avoids opening too many DB connections to Neon/Postgres.
 */
function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
