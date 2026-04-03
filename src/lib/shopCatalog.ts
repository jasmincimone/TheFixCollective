import { prisma } from "@/lib/prisma";
import { LISTING_STATUS } from "@/lib/roles";
import type { ShopSlug } from "@/config/shops";
import type { Product, ProductOption } from "@/types/product";

function parseOptionsJson(raw: string | null | undefined): ProductOption[] | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return undefined;
    return v as ProductOption[];
  } catch {
    return undefined;
  }
}

export function shopListingToProduct(row: {
  id: string;
  shopSlug: string;
  name: string;
  summary: string;
  description: string;
  priceCents: number;
  type: string;
  categoryId: string;
  imageUrl: string | null;
  imageFit: string | null;
  badge: string | null;
  format: string | null;
  optionsJson: string | null;
  stripePaymentLink: string | null;
}): Product {
  const imageFit =
    row.imageFit === "contain" ? "contain" : row.imageFit === "cover" ? "cover" : undefined;
  return {
    id: row.id,
    name: row.name,
    summary: row.summary,
    description: row.description,
    price: row.priceCents,
    type: row.type === "digital" ? "digital" : "physical",
    shop: row.shopSlug as ShopSlug,
    categoryId: row.categoryId,
    image: row.imageUrl?.trim() || undefined,
    imageFit,
    badge: row.badge?.trim() || undefined,
    format: row.format?.trim() || undefined,
    options: parseOptionsJson(row.optionsJson),
    stripePaymentLink: row.stripePaymentLink?.trim() || undefined,
  };
}

/** Published catalog product by id, or undefined. */
export async function getMergedProductForPublic(id: string): Promise<Product | undefined> {
  const row = await prisma.shopCatalogListing.findUnique({ where: { id } });
  if (!row || row.status !== LISTING_STATUS.PUBLISHED) return undefined;
  return shopListingToProduct(row);
}

/** Checkout and server validation: same rules as public catalog. */
export async function getMergedProductForCheckout(id: string): Promise<Product | undefined> {
  return getMergedProductForPublic(id);
}

export async function getMergedProductsByShopForPublic(shop: string): Promise<Product[]> {
  const dbRows = await prisma.shopCatalogListing.findMany({
    where: { shopSlug: shop, status: LISTING_STATUS.PUBLISHED },
    orderBy: { updatedAt: "desc" },
  });
  return dbRows.map((r) => shopListingToProduct(r));
}

export async function getAllMergedProductsForPublic(): Promise<Product[]> {
  const slugs: ShopSlug[] = ["urban-roots", "self-care", "stitch", "survival-kits"];
  const out: Product[] = [];
  for (const slug of slugs) {
    out.push(...(await getMergedProductsByShopForPublic(slug)));
  }
  return out;
}
