import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { isTwoFactorMethod, TWO_FACTOR_METHOD } from "@/lib/twoFactor";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      createdAt: true,
      twoFactorMethod: true,
      phone: true,
      phoneVerifiedAt: true,
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    twoFactorMethod: user.twoFactorMethod || TWO_FACTOR_METHOD.NONE,
    phone: user.phone,
    phoneVerifiedAt: user.phoneVerifiedAt?.toISOString() ?? null,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const raw = body?.twoFactorMethod;
    if (typeof raw !== "string" || !isTwoFactorMethod(raw)) {
      return NextResponse.json({ error: "Invalid twoFactorMethod" }, { status: 400 });
    }
    if (raw === TWO_FACTOR_METHOD.SMS) {
      const u = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { phone: true, phoneVerifiedAt: true },
      });
      if (!u?.phone || !u.phoneVerifiedAt) {
        return NextResponse.json(
          { error: "Verify your phone number before enabling SMS two-factor." },
          { status: 400 }
        );
      }
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorMethod: raw },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("account/settings PATCH:", e);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
