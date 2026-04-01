import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_NAME = 120;

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const nameRaw = body?.name;
    if (typeof nameRaw !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const name = nameRaw.trim() || null;
    if (name && name.length > MAX_NAME) {
      return NextResponse.json({ error: `Name must be at most ${MAX_NAME} characters` }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });
    return NextResponse.json({ ok: true, name });
  } catch (e) {
    console.error("account/profile PATCH:", e);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
