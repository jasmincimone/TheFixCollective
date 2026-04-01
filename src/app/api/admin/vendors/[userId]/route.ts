import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/permissions";
import { ROLES, VENDOR_STATUS } from "@/lib/roles";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const action = body?.action as string | undefined;
  const userId = params.userId;

  const profile = await prisma.vendorProfile.findUnique({
    where: { userId },
  });
  if (!profile) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  if (action === "approve") {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: ROLES.VENDOR },
      }),
      prisma.vendorProfile.update({
        where: { userId },
        data: { status: VENDOR_STATUS.APPROVED },
      }),
    ]);
    return NextResponse.json({ ok: true });
  }

  if (action === "reject") {
    await prisma.vendorProfile.update({
      where: { userId },
      data: { status: VENDOR_STATUS.REJECTED },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
