import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/permissions";
import { ROLES } from "@/lib/roles";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const role = body?.role as string | undefined;
  if (role !== ROLES.ADMIN && role !== ROLES.VENDOR && role !== ROLES.CUSTOMER) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (params.id === session.user.id && role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Cannot demote yourself" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: params.id },
    data: { role },
  });

  return NextResponse.json({ ok: true });
}
