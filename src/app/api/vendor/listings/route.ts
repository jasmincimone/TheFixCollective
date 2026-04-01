import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { normalizePaymentUrl, normalizeProductUrl } from "@/lib/paymentUrl";
import { prisma } from "@/lib/prisma";
import { requireApprovedVendorGate } from "@/lib/vendorListingAccess";
import { LISTING_STATUS } from "@/lib/roles";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const gate = await requireApprovedVendorGate(session.user.id);
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: 403 });
  }

  const listings = await prisma.marketplaceListing.findMany({
    where: { vendorProfileId: gate.vendorProfileId },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ listings });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const gate = await requireApprovedVendorGate(session.user.id);
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, priceCents, category, imageUrl, status, paymentUrl, productUrl } =
    body as {
      title?: string;
      description?: string;
      priceCents?: number;
      category?: string;
      imageUrl?: string;
      status?: string;
      paymentUrl?: string | null;
      productUrl?: string | null;
    };

  if (!title?.trim() || !description?.trim() || priceCents == null || priceCents < 0) {
    return NextResponse.json({ error: "Invalid listing data" }, { status: 400 });
  }

  let paymentUrlNorm: string | null;
  let productUrlNorm: string | null;
  try {
    paymentUrlNorm = normalizePaymentUrl(paymentUrl ?? null);
    productUrlNorm = normalizeProductUrl(productUrl ?? null);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid link";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const st =
    status === LISTING_STATUS.PUBLISHED || status === LISTING_STATUS.ARCHIVED
      ? status
      : LISTING_STATUS.DRAFT;

  const listing = await prisma.marketplaceListing.create({
    data: {
      vendorProfileId: gate.vendorProfileId,
      title: title.trim(),
      description: description.trim(),
      priceCents: Math.round(priceCents),
      category: category?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      paymentUrl: paymentUrlNorm,
      productUrl: productUrlNorm,
      status: st,
    },
  });

  return NextResponse.json({ listing });
}
