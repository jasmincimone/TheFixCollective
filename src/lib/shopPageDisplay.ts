import {
  getShop,
  type ShopCategory,
  type ShopLandingContent,
  type ShopProduct,
  type ShopSlug,
} from "@/config/shops";
import type { ShopFeatureCard } from "@/config/shopFeatures";
import { prisma } from "@/lib/prisma";

function isShopCategory(x: unknown): x is ShopCategory {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.description === "string"
  );
}

function isShopProduct(x: unknown): x is ShopProduct {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.summary === "string" &&
    (o.badge === undefined || typeof o.badge === "string")
  );
}

function parseCategoriesJson(raw: unknown): ShopCategory[] | null {
  if (!Array.isArray(raw) || !raw.every(isShopCategory)) return null;
  return raw;
}

function parseFeaturedJson(raw: unknown): ShopProduct[] | null {
  if (!Array.isArray(raw) || !raw.every(isShopProduct)) return null;
  return raw;
}

function isFeatureCard(x: unknown): x is ShopFeatureCard {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    typeof o.href === "string" &&
    typeof o.cta === "string"
  );
}

function parseFeatureSectionsJson(raw: unknown): ShopFeatureCard[] | null {
  if (!Array.isArray(raw) || !raw.every(isFeatureCard)) return null;
  return raw;
}

export type MergedShopPageDisplay = {
  shopSlug: ShopSlug;
  name: string;
  tagline: string;
  description: string;
  content: ShopLandingContent;
  features: ShopFeatureCard[];
};

export async function loadMergedShopDisplay(slug: string): Promise<MergedShopPageDisplay | null> {
  const shop = getShop(slug);
  if (!shop) return null;

  const shopKey = shop.slug as ShopSlug;
  const row = await prisma.shopPage.findUnique({ where: { shopSlug: shop.slug } });

  const categories = parseCategoriesJson(row?.categoriesJson) ?? [];
  const featured = parseFeaturedJson(row?.featuredJson) ?? [];
  const content: ShopLandingContent = { categories, featured };

  const features = parseFeatureSectionsJson(row?.featureSectionsJson) ?? [];

  return {
    shopSlug: shopKey,
    name: row?.name?.trim() || shop.name,
    tagline: row?.tagline?.trim() || shop.tagline,
    description: row?.description?.trim() || shop.description,
    content,
    features,
  };
}
