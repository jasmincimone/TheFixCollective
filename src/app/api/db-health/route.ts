import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Quick check that Prisma can reach Postgres and the `User` table exists.
 * Open GET /api/db-health on the deployed site while debugging Vercel + Neon.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`;
    return NextResponse.json({ ok: true, detail: "Connected; User table readable." });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        ok: false,
        detail: message,
      },
      { status: 500 }
    );
  }
}
