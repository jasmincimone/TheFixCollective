import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { responseForPrismaError } from "@/lib/prismaHttpError";
import { verifyPassword } from "@/lib/auth";
import { generateOtpDigits, hashOtpCode } from "@/lib/auth-tokens";
import { sendLoginOtpEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";
import { CHALLENGE_CHANNEL, CHALLENGE_PURPOSE, TWO_FACTOR_METHOD } from "@/lib/twoFactor";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const emailRaw = body?.email as string | undefined;
    const password = typeof body?.password === "string" ? body.password : "";
    const emailNorm = emailRaw?.trim().toLowerCase();
    if (!emailNorm || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const tf = user.twoFactorMethod || TWO_FACTOR_METHOD.NONE;
    if (tf === TWO_FACTOR_METHOD.NONE) {
      return NextResponse.json({ skipTwoFactor: true });
    }
    if (tf === TWO_FACTOR_METHOD.SMS && (!user.phone || !user.phoneVerifiedAt)) {
      return NextResponse.json(
        {
          error:
            "SMS two-factor is enabled but your phone is not verified. Turn off SMS two-factor in Account → Settings, or contact support.",
        },
        { status: 400 }
      );
    }
    if (tf === TWO_FACTOR_METHOD.EMAIL) {
      const key = process.env.RESEND_API_KEY;
      const from = process.env.EMAIL_FROM;
      if (!key || !from) {
        return NextResponse.json(
          { error: "Email sign-in codes are not configured on this server." },
          { status: 503 }
        );
      }
    }
    if (tf === TWO_FACTOR_METHOD.SMS) {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const tok = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_FROM_NUMBER;
      if (!sid || !tok || !from) {
        return NextResponse.json(
          { error: "SMS sign-in codes are not configured on this server." },
          { status: 503 }
        );
      }
    }

    await prisma.loginChallenge.deleteMany({
      where: {
        userId: user.id,
        purpose: CHALLENGE_PURPOSE.LOGIN,
        consumedAt: null,
      },
    });

    const challengeId = randomUUID();
    const code = generateOtpDigits();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const channel =
      tf === TWO_FACTOR_METHOD.SMS ? CHALLENGE_CHANNEL.SMS : CHALLENGE_CHANNEL.EMAIL;

    await prisma.loginChallenge.create({
      data: {
        id: challengeId,
        userId: user.id,
        purpose: CHALLENGE_PURPOSE.LOGIN,
        channel,
        codeHash: hashOtpCode(code, challengeId),
        expiresAt,
      },
    });

    if (channel === CHALLENGE_CHANNEL.EMAIL) {
      const sent = await sendLoginOtpEmail(user.email, code);
      if (!sent.ok) {
        await prisma.loginChallenge.delete({ where: { id: challengeId } }).catch(() => {});
        return NextResponse.json(
          { error: sent.error || "Could not send sign-in code." },
          { status: 503 }
        );
      }
    } else {
      const sent = await sendSms(user.phone!, `Your sign-in code is ${code}. It expires in 10 minutes.`);
      if (!sent.ok) {
        await prisma.loginChallenge.delete({ where: { id: challengeId } }).catch(() => {});
        return NextResponse.json(
          { error: sent.error || "Could not send SMS." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({
      needsTwoFactor: true,
      challengeId,
      channel,
    });
  } catch (e) {
    console.error("login-prepare:", e);
    const mapped = responseForPrismaError(e);
    if (mapped) {
      return NextResponse.json({ error: mapped.error }, { status: mapped.status });
    }
    return NextResponse.json({ error: "Request failed." }, { status: 500 });
  }
}
