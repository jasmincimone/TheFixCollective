import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/permissions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pending = await prisma.vendorProfile.findMany({
    where: { status: "PENDING" },
    include: { user: { select: { id: true, email: true, name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ vendors: pending });
}
