import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { VENDOR_STATUS } from "@/lib/roles";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { displayName, bio, contactEmail, pickupLocation } = body as {
    displayName?: string;
    bio?: string;
    contactEmail?: string;
    pickupLocation?: string;
  };

  if (!displayName?.trim()) {
    return NextResponse.json({ error: "Display name is required" }, { status: 400 });
  }

  const existing = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "You already have a vendor application." }, { status: 400 });
  }

  await prisma.vendorProfile.create({
    data: {
      userId: session.user.id,
      displayName: displayName.trim(),
      bio: bio?.trim() || null,
      contactEmail: contactEmail?.trim() || null,
      pickupLocation: pickupLocation?.trim() || null,
      status: VENDOR_STATUS.PENDING,
    },
  });

  return NextResponse.json({ ok: true });
}
