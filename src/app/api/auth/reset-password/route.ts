import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { hashResetToken } from "@/lib/auth-tokens";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!token || !password) {
      return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    const tokenHash = hashResetToken(token);
    const row = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!row) {
      return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
    }
    const passwordHash = hashPassword(password);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.updateMany({
        where: { userId: row.userId },
        data: { usedAt: new Date() },
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reset-password:", e);
    return NextResponse.json({ error: "Reset failed." }, { status: 500 });
  }
}
