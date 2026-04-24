import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { verifyPassword } from "@/lib/auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { TWO_FACTOR_METHOD } from "@/lib/twoFactor";

export const runtime = "nodejs";

/** Clears phone; if SMS 2FA was on, turns two-factor off to avoid lockout. */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Enter your current password to remove phone security settings." },
        { status: 401 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorMethod: true, passwordHash: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (!user.passwordHash) {
      return NextResponse.json({ error: "Password sign-in is not set for this account." }, { status: 400 });
    }
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    const tf = user.twoFactorMethod || TWO_FACTOR_METHOD.NONE;
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone: null,
        phoneVerifiedAt: null,
        consentSmsTwoFactorAt: null,
        ...(tf === TWO_FACTOR_METHOD.SMS ? { twoFactorMethod: TWO_FACTOR_METHOD.NONE } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("phone/remove:", e);
    return NextResponse.json({ error: "Could not remove phone." }, { status: 500 });
  }
}
