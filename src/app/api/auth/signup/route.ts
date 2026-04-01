import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { ROLES } from "@/lib/roles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body as { email?: string; password?: string; name?: string };
    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const emailNorm = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }
    const passwordHash = hashPassword(password);
    await prisma.user.create({
      data: {
        email: emailNorm,
        passwordHash,
        name: name?.trim() || null,
        role: ROLES.CUSTOMER,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Signup error:", e);
    if (e instanceof Error && e.message.includes("Unable to open the database file")) {
      return NextResponse.json(
        {
          error:
            "Can't reach the database. Set DATABASE_URL to file:./dev.db in .env.local (SQLite file at prisma/dev.db), then restart the dev server.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
