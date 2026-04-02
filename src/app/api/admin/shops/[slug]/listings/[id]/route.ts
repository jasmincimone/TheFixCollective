import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { parseShopSlugParam } from "@/lib/adminShop";
import { isAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { LISTING_STATUS } from "@/lib/roles";

export const dynamic = "force-dynamic";

function normalizeStatus(v: string | undefined) {
  if (v === LISTING_STATUS.PUBLISHED || v === LISTING_STATUS.ARCHIVED) return v;
  return LISTING_STATUS.DRAFT;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string; id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = parseShopSlugParam(params.slug);
  if (!slug) {
    return NextResponse.json({ error: "Unknown shop" }, { status: 404 });
  }

  const listing = await prisma.shopCatalogListing.findUnique({
    where: { id: params.id },
  });
  if (!listing || listing.shopSlug !== slug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ listing });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = parseShopSlugParam(params.slug);
  if (!slug) {
    return NextResponse.json({ error: "Unknown shop" }, { status: 404 });
  }

  const existing = await prisma.shopCatalogListing.findUnique({
    where: { id: params.id },
  });
  if (!existing || existing.shopSlug !== slug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    name,
    summary,
    description,
    priceCents,
    type,
    categoryId,
    imageUrl,
    imageFit,
    badge,
    format,
    optionsJson,
    stripePaymentLink,
    status,
  } = body as {
    name?: string;
    summary?: string;
    description?: string;
    priceCents?: number;
    type?: string;
    categoryId?: string;
    imageUrl?: string | null;
    imageFit?: string | null;
    badge?: string | null;
    format?: string | null;
    optionsJson?: string | null;
    stripePaymentLink?: string | null;
    status?: string;
  };

  if (name !== undefined && !name.trim()) {
    return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
  }
  if (summary !== undefined && !summary.trim()) {
    return NextResponse.json({ error: "Summary cannot be empty" }, { status: 400 });
  }
  if (description !== undefined && !description.trim()) {
    return NextResponse.json({ error: "Description cannot be empty" }, { status: 400 });
  }
  if (priceCents !== undefined) {
    if (typeof priceCents !== "number" || priceCents < 0 || !Number.isFinite(priceCents)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
  }
  if (optionsJson !== undefined && optionsJson?.trim()) {
    try {
      JSON.parse(optionsJson);
    } catch {
      return NextResponse.json({ error: "optionsJson must be valid JSON" }, { status: 400 });
    }
  }

  const productType =
    type === undefined ? undefined : type === "digital" ? "digital" : "physical";

  const listing = await prisma.shopCatalogListing.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(summary !== undefined ? { summary: summary.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(priceCents !== undefined ? { priceCents: Math.round(priceCents) } : {}),
      ...(productType !== undefined ? { type: productType } : {}),
      ...(categoryId !== undefined ? { categoryId: categoryId.trim() } : {}),
      ...(imageUrl !== undefined ? { imageUrl: imageUrl?.trim() || null } : {}),
      ...(imageFit !== undefined
        ? {
            imageFit: imageFit === "contain" ? "contain" : imageFit === "cover" ? "cover" : null,
          }
        : {}),
      ...(badge !== undefined ? { badge: badge?.trim() || null } : {}),
      ...(format !== undefined ? { format: format?.trim() || null } : {}),
      ...(optionsJson !== undefined ? { optionsJson: optionsJson?.trim() || null } : {}),
      ...(stripePaymentLink !== undefined
        ? { stripePaymentLink: stripePaymentLink?.trim() || null }
        : {}),
      ...(status !== undefined ? { status: normalizeStatus(status) } : {}),
    },
  });

  return NextResponse.json({ listing });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string; id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = parseShopSlugParam(params.slug);
  if (!slug) {
    return NextResponse.json({ error: "Unknown shop" }, { status: 404 });
  }

  const existing = await prisma.shopCatalogListing.findUnique({
    where: { id: params.id },
  });
  if (!existing || existing.shopSlug !== slug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.shopCatalogListing.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
