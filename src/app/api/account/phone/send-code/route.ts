import { randomUUID } from "crypto";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { generateOtpDigits, hashOtpCode } from "@/lib/auth-tokens";
import { prisma } from "@/lib/prisma";
import { normalizeE164 } from "@/lib/phone";
import { sendSms } from "@/lib/sms";
import { CHALLENGE_CHANNEL, CHALLENGE_PURPOSE } from "@/lib/twoFactor";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const phone = normalizeE164(typeof body?.phone === "string" ? body.phone : "");
    if (!phone) {
      return NextResponse.json(
        { error: "Enter a valid phone number in international format (e.g. +15551234567)." },
        { status: 400 }
      );
    }
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const tok = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;
    if (!sid || !tok || !from) {
      return NextResponse.json({ error: "SMS is not configured on this server." }, { status: 503 });
    }

    await prisma.loginChallenge.deleteMany({
      where: {
        userId: session.user.id,
        purpose: CHALLENGE_PURPOSE.PHONE_VERIFY,
        consumedAt: null,
      },
    });

    const challengeId = randomUUID();
    const code = generateOtpDigits();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.loginChallenge.create({
      data: {
        id: challengeId,
        userId: session.user.id,
        purpose: CHALLENGE_PURPOSE.PHONE_VERIFY,
        channel: CHALLENGE_CHANNEL.SMS,
        codeHash: hashOtpCode(code, challengeId),
        targetPhone: phone,
        expiresAt,
      },
    });

    const sent = await sendSms(phone, `Your verification code is ${code}. It expires in 10 minutes.`);
    if (!sent.ok) {
      await prisma.loginChallenge.delete({ where: { id: challengeId } }).catch(() => {});
      return NextResponse.json({ error: sent.error || "Could not send SMS." }, { status: 503 });
    }

    return NextResponse.json({ challengeId });
  } catch (e) {
    console.error("phone/send-code:", e);
    return NextResponse.json({ error: "Request failed." }, { status: 500 });
  }
}
