import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { hashPassword, verifyPassword } from "@/lib/auth";
import { authOptions } from "@/lib/authOptions";
import { validateStrongPassword } from "@/lib/passwordPolicy";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password required" }, { status: 400 });
    }
    const passwordError = validateStrongPassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Password sign-in is not set for this account." }, { status: 400 });
    }
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hashPassword(newPassword) },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("change-password:", e);
    return NextResponse.json({ error: "Could not update password." }, { status: 500 });
  }
}
