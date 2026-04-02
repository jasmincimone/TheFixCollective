import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { getShop, SHOP_CONTENT } from "@/config/shops";
import { DEFAULT_SHOP_FEATURE_SECTIONS } from "@/config/shopFeatures";
import { parseShopSlugParam } from "@/lib/adminShop";
import { isAdmin } from "@/lib/permissions";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function jsonStringifyPretty(v: unknown): string {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return "";
  }
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

  const shop = getShop(slug);
  if (!shop) {
    return NextResponse.json({ error: "Unknown shop" }, { status: 404 });
  }

  const baseContent = SHOP_CONTENT[slug];
  const baseFeatures = DEFAULT_SHOP_FEATURE_SECTIONS[slug] ?? [];
  const row = await prisma.shopPage.findUnique({ where: { shopSlug: slug } });

  const form = {
    name: row?.name?.trim() || shop.name,
    tagline: row?.tagline?.trim() || shop.tagline,
    description: row?.description?.trim() || shop.description,
    categoriesJson:
      row?.categoriesJson != null ? jsonStringifyPretty(row.categoriesJson) : jsonStringifyPretty(baseContent.categories),
    featuredJson:
      row?.featuredJson != null ? jsonStringifyPretty(row.featuredJson) : jsonStringifyPretty(baseContent.featured),
    featureSectionsJson:
      row?.featureSectionsJson != null
        ? jsonStringifyPretty(row.featureSectionsJson)
        : jsonStringifyPretty(baseFeatures),
  };

  return NextResponse.json({
    shopSlug: slug,
    hasSavedOverrides: !!row,
    form,
  });
}

export async function PATCH(
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
    name,
    tagline,
    description,
    categoriesJson: categoriesRaw,
    featuredJson: featuredRaw,
    featureSectionsJson: featuresRaw,
    reset,
  } = body as {
    name?: string;
    tagline?: string;
    description?: string;
    categoriesJson?: string;
    featuredJson?: string;
    featureSectionsJson?: string;
    reset?: boolean;
  };

  if (reset) {
    await prisma.shopPage.deleteMany({ where: { shopSlug: slug } });
    return NextResponse.json({ ok: true, reset: true });
  }

  function parseJsonField(raw: string | undefined, field: string) {
    const t = raw?.trim();
    if (!t) return null;
    try {
      return JSON.parse(t) as unknown;
    } catch {
      throw new Error(`Invalid JSON for ${field}`);
    }
  }

  let categoriesJson: unknown = null;
  let featuredJson: unknown = null;
  let featureSectionsJson: unknown = null;
  try {
    categoriesJson = parseJsonField(categoriesRaw, "categories");
    featuredJson = parseJsonField(featuredRaw, "featured");
    featureSectionsJson = parseJsonField(featuresRaw, "feature sections");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const shop = getShop(slug);
  const baseContent = SHOP_CONTENT[slug];
  const baseFeatures = DEFAULT_SHOP_FEATURE_SECTIONS[slug] ?? [];

  const nameTrim = name?.trim() || null;
  const taglineTrim = tagline?.trim() || null;
  const descTrim = description?.trim() || null;

  const storeName = shop && nameTrim && nameTrim !== shop.name ? nameTrim : null;
  const storeTagline = shop && taglineTrim && taglineTrim !== shop.tagline ? taglineTrim : null;
  const storeDesc = shop && descTrim && descTrim !== shop.description ? descTrim : null;

  const defaultsCat = JSON.stringify(baseContent.categories);
  const defaultsFeat = JSON.stringify(baseContent.featured);
  const defaultsFeatures = JSON.stringify(baseFeatures);
  const storeCategories =
    categoriesJson != null && JSON.stringify(categoriesJson) !== defaultsCat ? categoriesJson : null;
  const storeFeatured =
    featuredJson != null && JSON.stringify(featuredJson) !== defaultsFeat ? featuredJson : null;
  const storeFeatureSections =
    featureSectionsJson != null && JSON.stringify(featureSectionsJson) !== defaultsFeatures
      ? featureSectionsJson
      : null;

  const isEmpty =
    !storeName &&
    !storeTagline &&
    !storeDesc &&
    storeCategories == null &&
    storeFeatured == null &&
    storeFeatureSections == null;

  if (isEmpty) {
    await prisma.shopPage.deleteMany({ where: { shopSlug: slug } });
    return NextResponse.json({ ok: true });
  }

  await prisma.shopPage.upsert({
    where: { shopSlug: slug },
    create: {
      shopSlug: slug,
      name: storeName,
      tagline: storeTagline,
      description: storeDesc,
      categoriesJson: storeCategories ?? undefined,
      featuredJson: storeFeatured ?? undefined,
      featureSectionsJson: storeFeatureSections ?? undefined,
    },
    update: {
      name: storeName,
      tagline: storeTagline,
      description: storeDesc,
      categoriesJson:
        storeCategories === null ? Prisma.DbNull : (storeCategories as Prisma.InputJsonValue),
      featuredJson:
        storeFeatured === null ? Prisma.DbNull : (storeFeatured as Prisma.InputJsonValue),
      featureSectionsJson:
        storeFeatureSections === null
          ? Prisma.DbNull
          : (storeFeatureSections as Prisma.InputJsonValue),
    },
  });

  return NextResponse.json({ ok: true });
}
