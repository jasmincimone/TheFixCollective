import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ROLES, VENDOR_STATUS } from "@/lib/roles";

export async function GET() {
  const posts = await prisma.communityPost.findMany({
    include: {
      author: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to post" }, { status: 401 });
  }

  const body = await request.json();
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content || content.length > 8000) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { vendorProfile: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const role = user.role;
  const roleAtPost =
    role === ROLES.ADMIN ? "ADMIN" : role === ROLES.VENDOR ? "VENDOR" : "CUSTOMER";
  const showVendorBadge =
    role === ROLES.VENDOR && user.vendorProfile?.status === VENDOR_STATUS.APPROVED;

  const post = await prisma.communityPost.create({
    data: {
      authorId: user.id,
      content,
      roleAtPost,
      showVendorBadge,
    },
    include: {
      author: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  return NextResponse.json({ post });
}
