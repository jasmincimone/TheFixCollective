import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { parseShopSlugParam } from "@/lib/adminShop";
import { PRODUCTS } from "@/data/products";
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
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = parseShopSlugParam(params.slug);
  if (!slug) {
    return NextResponse.json({ error: "Unknown shop" }, { status: 404 });
  }

  const dbListings = await prisma.shopCatalogListing.findMany({
    where: { shopSlug: slug },
    orderBy: { updatedAt: "desc" },
  });
  const dbById = new Map(dbListings.map((l) => [l.id, l]));

  const seedForShop = PRODUCTS.filter((p) => p.shop === slug).map((p) => ({
    id: p.id,
    name: p.name,
    summary: p.summary,
    priceCents: p.price,
    type: p.type,
    categoryId: p.categoryId,
    imageUrl: p.image ?? null,
  }));
  const seedIds = new Set(seedForShop.map((s) => s.id));

  const items: Array<
    | {
        rowKind: "built-in";
        seed: (typeof seedForShop)[number];
        dbListing: (typeof dbListings)[number] | null;
      }
    | { rowKind: "database-only"; dbListing: (typeof dbListings)[number] }
  > = seedForShop.map((seed) => ({
    rowKind: "built-in" as const,
    seed,
    dbListing: dbById.get(seed.id) ?? null,
  }));

  for (const l of dbListings) {
    if (!seedIds.has(l.id)) {
      items.push({ rowKind: "database-only" as const, dbListing: l });
    }
  }

  return NextResponse.json({ listings: dbListings, items });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = parseShopSlugParam(params.slug);
  if (!slug) {
    return NextResponse.json({ error: "Unknown shop" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    id: customId,
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
    id?: string;
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

  if (!name?.trim() || !summary?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Name, summary, and description are required" }, { status: 400 });
  }
  if (priceCents == null || typeof priceCents !== "number" || priceCents < 0 || !Number.isFinite(priceCents)) {
    return NextResponse.json({ error: "Valid priceCents required" }, { status: 400 });
  }
  const productType = type === "digital" ? "digital" : "physical";
  if (!categoryId?.trim()) {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  if (customId?.trim()) {
    const row = await prisma.shopCatalogListing.findUnique({
      where: { id: customId.trim() },
    });
    if (row) {
      return NextResponse.json(
        {
          error:
            "That product id is already used. Edit the existing listing or leave id blank for a new product.",
        },
        { status: 409 },
      );
    }
  }

  if (optionsJson?.trim()) {
    try {
      JSON.parse(optionsJson);
    } catch {
      return NextResponse.json({ error: "optionsJson must be valid JSON" }, { status: 400 });
    }
  }

  const listing = await prisma.shopCatalogListing.create({
    data: {
      ...(customId?.trim() ? { id: customId.trim() } : {}),
      shopSlug: slug,
      name: name.trim(),
      summary: summary.trim(),
      description: description.trim(),
      priceCents: Math.round(priceCents),
      type: productType,
      categoryId: categoryId.trim(),
      imageUrl: imageUrl?.trim() || null,
      imageFit: imageFit === "contain" ? "contain" : imageFit === "cover" ? "cover" : null,
      badge: badge?.trim() || null,
      format: format?.trim() || null,
      optionsJson: optionsJson?.trim() || null,
      stripePaymentLink: stripePaymentLink?.trim() || null,
      status: normalizeStatus(status),
    },
  });

  return NextResponse.json({ listing });
}
