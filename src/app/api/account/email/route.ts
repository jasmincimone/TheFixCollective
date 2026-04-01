import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { verifyPassword } from "@/lib/auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const newEmailRaw = typeof body?.newEmail === "string" ? body.newEmail.trim() : "";
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    if (!newEmailRaw || !currentPassword) {
      return NextResponse.json({ error: "New email and current password required" }, { status: 400 });
    }
    const newEmail = newEmailRaw.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, passwordHash: true },
    });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Password sign-in is not set for this account." }, { status: 400 });
    }
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    if (newEmail === user.email.toLowerCase()) {
      return NextResponse.json({ error: "That is already your email address." }, { status: 400 });
    }
    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { email: newEmail },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return NextResponse.json({ error: "That email is already in use." }, { status: 400 });
      }
      throw err;
    }
    return NextResponse.json({ ok: true, email: newEmail });
  } catch (e) {
    console.error("account/email PATCH:", e);
    return NextResponse.json({ error: "Could not update email." }, { status: 500 });
  }
}
