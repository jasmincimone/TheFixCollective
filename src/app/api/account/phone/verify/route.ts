import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { normalizeOtpSixDigits, otpCodesEqual } from "@/lib/auth-tokens";
import { prisma } from "@/lib/prisma";
import { responseForPrismaError } from "@/lib/prismaHttpError";
import { CHALLENGE_PURPOSE } from "@/lib/twoFactor";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const challengeId = typeof body?.challengeId === "string" ? body.challengeId.trim() : "";
    const rawCode = typeof body?.code === "string" ? body.code : "";
    const code = normalizeOtpSixDigits(rawCode);
    if (!challengeId || code.length !== 6) {
      return NextResponse.json(
        { error: "Enter the 6-digit code from the text message (numbers only)." },
        { status: 400 }
      );
    }
    const challenge = await prisma.loginChallenge.findUnique({
      where: { id: challengeId },
    });
    if (
      !challenge ||
      challenge.userId !== session.user.id ||
      challenge.purpose !== CHALLENGE_PURPOSE.PHONE_VERIFY
    ) {
      return NextResponse.json({ error: "Invalid or expired verification." }, { status: 400 });
    }
    if (challenge.consumedAt) {
      return NextResponse.json({ error: "Code already used." }, { status: 400 });
    }
    if (challenge.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expired." }, { status: 400 });
    }
    if (!challenge.targetPhone) {
      return NextResponse.json({ error: "Invalid challenge." }, { status: 400 });
    }
    if (!otpCodesEqual(challenge.codeHash, code, challenge.id)) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    try {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: session.user.id },
          data: {
            phone: challenge.targetPhone,
            phoneVerifiedAt: new Date(),
          },
        }),
        prisma.loginChallenge.update({
          where: { id: challenge.id },
          data: { consumedAt: new Date() },
        }),
      ]);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return NextResponse.json(
          { error: "This phone number is already linked to another account." },
          { status: 400 }
        );
      }
      throw err;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("phone/verify:", e);
    const mapped = responseForPrismaError(e);
    if (mapped) {
      return NextResponse.json({ error: mapped.error }, { status: mapped.status });
    }
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
